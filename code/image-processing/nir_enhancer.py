import cv2
import numpy as np
import matplotlib.pyplot as plt
from skimage import exposure
from skimage.util import img_as_ubyte
import os
import time
from datetime import datetime
import tkinter as tk
from tkinter import filedialog, ttk, messagebox
from PIL import Image, ImageTk
import threading
import io
from rembg import remove

class CombinedImageProcessor:
    def __init__(self):
        self.image = None
        self.enhanced_image = None
        self.original_image = None
        self.background_removed_image = None
        self.contrast_limit = 15
        self.num_clusters = 4
        self.mode = 0
        self.save_count = 0
        
    def load_image(self, image_path):
        """Load an image from the specified path"""
        try:
            # Read the image
            self.image = cv2.imread(image_path)
            
            # Check if image is loaded successfully
            if self.image is None:
                print(f"Error: Could not load image from {image_path}")
                return False
                
            # Store original image for reference
            self.original_image = self.image.copy()
            return True
        except Exception as e:
            print(f"Error loading image: {e}")
            return False
    
    def remove_background(self, image_path):
        """Remove background from the image using rembg"""
        try:
            # Read input image
            with open(image_path, 'rb') as input_file:
                input_data = input_file.read()
            
            # Process the image with rembg
            output_data = remove(input_data)
            
            # Convert to PIL Image
            removed_bg = Image.open(io.BytesIO(output_data))
            
            # Create black background
            black_bg = Image.new("RGBA", removed_bg.size, (0, 0, 0, 255))
            
            # Composite the foreground with black background
            final_img = Image.alpha_composite(black_bg, removed_bg)
            
            # Convert to OpenCV format (numpy array) for further processing
            opencv_image = np.array(final_img.convert('RGB'))
            # Convert RGB to BGR (OpenCV format)
            opencv_image = opencv_image[:, :, ::-1].copy() 
            
            self.image = opencv_image
            self.original_image = opencv_image.copy()
            self.background_removed_image = opencv_image.copy()
            
            return True
        except Exception as e:
            print(f"Error removing background: {e}")
            return False
    
    def enhance_nir_basic(self, img):
        """Basic NIR enhancement with contrast stretching and CLAHE"""
        # Convert to grayscale if it's not already
        if len(img.shape) == 3:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        else:
            gray = img.copy()
        
        # Apply CLAHE for adaptive histogram equalization
        clahe = cv2.createCLAHE(clipLimit=self.contrast_limit, tileGridSize=(16, 16))
        enhanced = clahe.apply(gray)
        
        return enhanced
    
    def enhance_nir_advanced(self, img):
        """Advanced NIR enhancement with bilateral filtering and sharpening"""
        # Convert to grayscale if it's not already
        if len(img.shape) == 3:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        else:
            gray = img.copy()
        
        # Apply contrast stretching
        p2, p98 = np.percentile(gray, (2, 98))
        stretched = exposure.rescale_intensity(gray, in_range=(p2, p98))
        
        # Convert to uint8 for OpenCV functions
        stretched = img_as_ubyte(stretched)
        
        # Apply bilateral filter to reduce noise while preserving edges
        bilateral = cv2.bilateralFilter(stretched, 9, 75, 75)
        
        # Apply CLAHE with user-controlled clip limit
        clahe = cv2.createCLAHE(clipLimit=self.contrast_limit, tileGridSize=(16, 16))
        clahe_applied = clahe.apply(bilateral)
        
        # Apply unsharp masking for edge enhancement
        gaussian = cv2.GaussianBlur(clahe_applied, (0, 0), 3)
        sharpened = cv2.addWeighted(clahe_applied, 1.5, gaussian, -0.5, 0)
        
        return sharpened
    
    def segment_nir(self, img):
        """Segment NIR image using k-means clustering"""
        # Convert to grayscale if it's not already
        if len(img.shape) == 3:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        else:
            gray = img.copy()
        
        # Enhance before clustering
        clahe = cv2.createCLAHE(clipLimit=self.contrast_limit, tileGridSize=(16, 16))
        enhanced = clahe.apply(gray)
        
        # Prepare for k-means
        pixel_vals = enhanced.reshape((-1, 1))
        pixel_vals = np.float32(pixel_vals)
        
        # Apply k-means clustering
        criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 15, 1.0)
        _, labels, centers = cv2.kmeans(pixel_vals, self.num_clusters, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
        
        # Convert back to image
        centers = np.uint8(centers)
        segmented_data = centers[labels.flatten()]
        segmented = segmented_data.reshape(enhanced.shape)
        
        return segmented
    
    def nir_false_color(self, img):
        """Convert NIR grayscale to false color representation for better visualization"""
        # Convert to grayscale if it's not already
        if len(img.shape) == 3:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        else:
            gray = img.copy()
            
        # Enhance first
        clahe = cv2.createCLAHE(clipLimit=self.contrast_limit, tileGridSize=(16, 16))
        enhanced = clahe.apply(gray)
        
        dimensions = enhanced.shape
        temp_frame = np.zeros((dimensions[0], dimensions[1], 3), dtype=np.uint8)
        
        # Map NIR intensity to a color scale
        # Lower values: blue/green, Higher values: red/yellow
        for i in range(dimensions[0]):
            for j in range(dimensions[1]):
                intensity = enhanced[i, j]
                if intensity < 85:  # Low reflectance in NIR
                    temp_frame[i, j] = (intensity*2, intensity, 0)  # Dark blue-green
                elif intensity < 170:  # Medium reflectance
                    temp_frame[i, j] = (0, intensity, intensity)  # Cyan-blue
                else:  # High reflectance (typically vegetation in NIR)
                    temp_frame[i, j] = (0, 255-intensity, intensity)  # Yellow-red
        
        return temp_frame
    
    def process_image(self):
        """Process the image based on the selected mode"""
        if self.image is None:
            print("Error: No image loaded")
            return None
            
        if self.mode == 0:  # Original (with background removed)
            self.enhanced_image = self.background_removed_image if self.background_removed_image is not None else self.original_image
        elif self.mode == 1:  # Basic Enhancement
            enhanced = self.enhance_nir_basic(self.original_image)
            # Convert back to 3 channels for display
            self.enhanced_image = cv2.cvtColor(enhanced, cv2.COLOR_GRAY2BGR)
        elif self.mode == 2:  # Advanced Enhancement
            enhanced = self.enhance_nir_advanced(self.original_image)
            # Convert back to 3 channels for display
            self.enhanced_image = cv2.cvtColor(enhanced, cv2.COLOR_GRAY2BGR)
        elif self.mode == 3:  # Segmentation
            segmented = self.segment_nir(self.original_image)
            # Convert back to 3 channels for display
            self.enhanced_image = cv2.cvtColor(segmented, cv2.COLOR_GRAY2BGR)
        elif self.mode == 4:  # False Color
            self.enhanced_image = self.nir_false_color(self.original_image)
        
        return self.enhanced_image
    
    def save_image(self, output_path=None):
        """Save the currently processed image"""
        if self.enhanced_image is None:
            print("Error: No processed image to save")
            return
            
        self.save_count += 1
        
        # Create Saved Images directory if it doesn't exist
        if not os.path.exists("Saved_Images"):
            os.makedirs("Saved_Images")
            
        # Save with timestamp
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        
        if output_path is None:
            filename = f"Saved_Images/nir_enhanced_{timestamp}.jpg"
        else:
            filename = output_path
        
        # Convert to RGB for saving
        save_img = cv2.cvtColor(self.enhanced_image, cv2.COLOR_BGR2RGB)
        
        # Save the image
        cv2.imwrite(filename, cv2.cvtColor(save_img, cv2.COLOR_RGB2BGR))
        print(f"Image saved as {filename}")
        return filename
    
    def plot_histogram(self):
        """Plot histogram of the current image"""
        if self.enhanced_image is None:
            print("Error: No image to analyze")
            return
            
        # Convert to grayscale if it's not already
        if len(self.enhanced_image.shape) == 3:
            if self.enhanced_image.shape[2] == 3:
                gray = cv2.cvtColor(self.enhanced_image, cv2.COLOR_BGR2GRAY)
            else:
                gray = self.enhanced_image[:,:,0]
        else:
            gray = self.enhanced_image
            
        # Plot histogram
        plt.figure(figsize=(10, 4))
        plt.hist(gray.ravel(), 256, [0, 256])
        plt.title('NIR Image Histogram')
        plt.xlabel('Intensity')
        plt.ylabel('Frequency')
        plt.tight_layout()
        plt.show()

class CombinedAppGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("NIR Image Enhancer with Background Removal")
        self.root.geometry("1200x900")
        
        self.processor = CombinedImageProcessor()
        self.current_image_path = None
        
        # Create frames
        self.control_frame = ttk.Frame(root, padding="10")
        self.control_frame.pack(fill=tk.X)
        
        self.image_frame = ttk.Frame(root)
        self.image_frame.pack(fill=tk.BOTH, expand=True)
        
        self.status_bar = ttk.Label(root, text="Ready", relief=tk.SUNKEN, anchor=tk.W)
        self.status_bar.pack(fill=tk.X, side=tk.BOTTOM)
        
        # Progress bar
        self.progress = ttk.Progressbar(root, orient=tk.HORIZONTAL, length=100, mode='indeterminate')
        self.progress.pack(fill=tk.X, side=tk.BOTTOM, before=self.status_bar)
        
        # Setup image display frames
        self.setup_image_display()
        
        # Controls
        self.setup_controls()
        
        # Bind resize event
        self.root.bind("<Configure>", self.on_resize)
        
    def setup_image_display(self):
        # Create a frame for holding the original and processed images
        self.display_frame = ttk.Frame(self.image_frame)
        self.display_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Original image frame
        self.original_frame = ttk.LabelFrame(self.display_frame, text="Original Image")
        self.original_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=5)
        
        self.original_canvas = tk.Canvas(self.original_frame, bg="gray")
        self.original_canvas.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # Background removed image frame
        self.bg_removed_frame = ttk.LabelFrame(self.display_frame, text="Background Removed")
        self.bg_removed_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=5)
        
        self.bg_removed_canvas = tk.Canvas(self.bg_removed_frame, bg="black")
        self.bg_removed_canvas.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # Enhanced image frame
        self.enhanced_frame = ttk.LabelFrame(self.display_frame, text="Enhanced Image")
        self.enhanced_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=5)
        
        self.enhanced_canvas = tk.Canvas(self.enhanced_frame, bg="black")
        self.enhanced_canvas.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
    def setup_controls(self):
        # File controls
        file_frame = ttk.LabelFrame(self.control_frame, text="File Operations")
        file_frame.pack(fill=tk.X, padx=5, pady=5)
        
        ttk.Button(file_frame, text="Open Image", command=self.open_image).grid(row=0, column=0, padx=5, pady=5)
        ttk.Button(file_frame, text="Save Enhanced Image", command=self.save_image).grid(row=0, column=1, padx=5, pady=5)
        
        # Processing controls
        process_frame = ttk.LabelFrame(self.control_frame, text="Processing Options")
        process_frame.pack(fill=tk.X, padx=5, pady=5)
        
        # Mode selection
        ttk.Label(process_frame, text="Enhancement Mode:").grid(row=0, column=0, padx=5, pady=5)
        modes = ["Background Removed Only", "Basic Enhancement", "Advanced Enhancement", 
                 "Segmentation", "False Color"]
        
        self.mode_combo = ttk.Combobox(process_frame, values=modes, state="readonly")
        self.mode_combo.current(0)
        self.mode_combo.grid(row=0, column=1, padx=5, pady=5)
        self.mode_combo.bind("<<ComboboxSelected>>", self.on_mode_change)
        
        # Contrast slider
        ttk.Label(process_frame, text="Contrast:").grid(row=0, column=2, padx=5, pady=5)
        self.contrast_var = tk.IntVar(value=15)
        contrast_slider = ttk.Scale(process_frame, from_=0, to=40, variable=self.contrast_var, 
                                   orient=tk.HORIZONTAL, length=150)
        contrast_slider.grid(row=0, column=3, padx=5, pady=5)
        contrast_slider.bind("<ButtonRelease-1>", self.on_contrast_change)
        
        # Clusters slider (for segmentation)
        ttk.Label(process_frame, text="Clusters:").grid(row=0, column=4, padx=5, pady=5)
        self.clusters_var = tk.IntVar(value=4)
        clusters_slider = ttk.Scale(process_frame, from_=2, to=8, variable=self.clusters_var, 
                                   orient=tk.HORIZONTAL, length=150)
        clusters_slider.grid(row=0, column=5, padx=5, pady=5)
        clusters_slider.bind("<ButtonRelease-1>", self.on_clusters_change)
        
        # Process button
        ttk.Button(process_frame, text="Process Image", command=self.process_image).grid(row=0, column=6, padx=5, pady=5)
        
        # Analysis
        analysis_frame = ttk.LabelFrame(self.control_frame, text="Analysis Tools")
        analysis_frame.pack(fill=tk.X, padx=5, pady=5)
        
        ttk.Button(analysis_frame, text="Show Histogram", command=self.show_histogram).pack(padx=5, pady=5)
        
    def open_image(self):
        file_path = filedialog.askopenfilename(filetypes=[
            ("Image files", "*.jpg *.jpeg *.png *.tif *.tiff *.bmp")])
        
        if file_path:
            self.current_image_path = file_path
            self.status_bar["text"] = f"Loading image: {os.path.basename(file_path)}"
            self.progress.start()
            self.root.update()
            
            # Start loading and processing in a separate thread
            threading.Thread(target=self.load_image_thread, args=(file_path,)).start()
    
    def load_image_thread(self, file_path):
        try:
            # First load the original image
            success = self.processor.load_image(file_path)
            if not success:
                self.root.after(0, lambda: self.status_bar.configure(text=f"Failed to load: {os.path.basename(file_path)}"))
                self.root.after(0, self.progress.stop)
                return
            
            # Display original image
            self.root.after(0, lambda: self.display_image(self.processor.original_image, self.original_canvas))
            self.root.after(0, lambda: self.status_bar.configure(text=f"Removing background..."))
            
            # Then remove background
            success = self.processor.remove_background(file_path)
            if not success:
                self.root.after(0, lambda: self.status_bar.configure(text=f"Failed to remove background"))
                self.root.after(0, self.progress.stop)
                return
            
            # Display background removed image
            self.root.after(0, lambda: self.display_image(self.processor.background_removed_image, self.bg_removed_canvas))
            
            # Set as enhanced image initially (mode 0 = background removed only)
            self.processor.enhanced_image = self.processor.background_removed_image
            self.root.after(0, lambda: self.display_image(self.processor.enhanced_image, self.enhanced_canvas))
            
            self.root.after(0, lambda: self.status_bar.configure(text=f"Image loaded and background removed: {os.path.basename(file_path)}"))
        
        except Exception as e:
            self.root.after(0, lambda: messagebox.showerror("Error", f"Error processing image: {str(e)}"))
            self.root.after(0, lambda: self.status_bar.configure(text=f"Error: {str(e)}"))
        finally:
            self.root.after(0, self.progress.stop)
    
    def process_image(self):
        if self.processor.image is None:
            self.status_bar["text"] = "No image loaded"
            return
        
        self.status_bar["text"] = "Processing image..."
        self.progress.start()
        self.root.update()
        
        # Run processing in a separate thread to keep UI responsive
        def process_thread():
            try:
                self.processor.process_image()
                self.root.after(0, lambda: self.display_image(self.processor.enhanced_image, self.enhanced_canvas))
                self.root.after(0, lambda: self.status_bar.configure(text="Processing complete"))
            except Exception as e:
                self.root.after(0, lambda: messagebox.showerror("Error", f"Error enhancing image: {str(e)}"))
                self.root.after(0, lambda: self.status_bar.configure(text=f"Error: {str(e)}"))
            finally:
                self.root.after(0, self.progress.stop)
        
        threading.Thread(target=process_thread).start()
    
    def save_image(self):
        if self.processor.enhanced_image is None:
            self.status_bar["text"] = "No processed image to save"
            return
        
        # Ask user for save location
        file_path = filedialog.asksaveasfilename(
            defaultextension=".jpg",
            filetypes=[("JPEG files", "*.jpg"), ("PNG files", "*.png"), ("All files", "*.*")],
            initialdir="./Saved_Images"
        )
        
        if file_path:
            saved_path = self.processor.save_image(file_path)
            if saved_path:
                self.status_bar["text"] = f"Image saved as {os.path.basename(saved_path)}"
    
    def show_histogram(self):
        if self.processor.enhanced_image is None:
            self.status_bar["text"] = "No image to analyze"
            return
        
        self.processor.plot_histogram()
    
    def display_image(self, img, canvas):
        if img is None:
            return
            
        # Convert to RGB for display
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Resize for display if needed
        canvas_width = canvas.winfo_width()
        canvas_height = canvas.winfo_height()
        
        if canvas_width > 1 and canvas_height > 1:  # Check if canvas has valid size
            # Calculate resize ratio while maintaining aspect ratio
            img_height, img_width = img_rgb.shape[:2]
            ratio = min(canvas_width/img_width, canvas_height/img_height)
            new_width = int(img_width * ratio)
            new_height = int(img_height * ratio)
            
            if new_width > 0 and new_height > 0:  # Ensure dimensions are valid
                img_resized = cv2.resize(img_rgb, (new_width, new_height))
                photo = ImageTk.PhotoImage(image=Image.fromarray(img_resized))
                
                # Clear previous content and display the new image
                canvas.delete("all")
                canvas.create_image(canvas_width//2, canvas_height//2, image=photo, anchor=tk.CENTER)
                # Keep a reference to prevent garbage collection
                canvas.image = photo
    
    def on_resize(self, event):
        # Only handle resize events for the main window
        if event.widget == self.root:
            # Update image displays after a short delay
            if hasattr(self, '_after_id'):
                self.root.after_cancel(self._after_id)
            self._after_id = self.root.after(100, self.update_all_displays)
    
    def update_all_displays(self):
        # Update all three image displays
        if self.processor.original_image is not None:
            self.display_image(self.processor.original_image, self.original_canvas)
        
        if self.processor.background_removed_image is not None:
            self.display_image(self.processor.background_removed_image, self.bg_removed_canvas)
        
        if self.processor.enhanced_image is not None:
            self.display_image(self.processor.enhanced_image, self.enhanced_canvas)
    
    def on_mode_change(self, event):
        mode_index = self.mode_combo.current()
        self.processor.mode = mode_index
    
    def on_contrast_change(self, event):
        self.processor.contrast_limit = self.contrast_var.get()
    
    def on_clusters_change(self, event):
        self.processor.num_clusters = self.clusters_var.get()

def main():
    root = tk.Tk()
    app = CombinedAppGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main()