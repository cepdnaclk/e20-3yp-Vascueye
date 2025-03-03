# VescuEye - NIR Image Enhancer with Background Removal

## Overview
NIR Image Enhancer is a desktop application that provides advanced processing tools for Near-Infrared (NIR) images. The application combines background removal with multiple enhancement modes to improve the quality and visibility of NIR imagery for analysis.

## Features
- **Background Removal**: Automatically remove backgrounds from NIR images
- **Multiple Enhancement Modes**:
  - Basic Enhancement: Simple contrast stretching and CLAHE
  - Advanced Enhancement: Bilateral filtering with sharpening
  - Segmentation: K-means clustering for region identification
  - False Color: Converts grayscale NIR images to a color-coded representation
- **Real-time Processing**: Preview changes with adjustable parameters
- **Image Analysis**: Built-in histogram visualization
- **Save Options**: Export enhanced images with timestamps


## Installation

### Requirements
- Python 3.7+
- OpenCV
- NumPy
- Matplotlib
- scikit-image
- Pillow
- rembg (for background removal)
- Tkinter (included with most Python installations)

### Setup Instructions

1. Create and activate a virtual environment (recommended):
```
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python -m venv venv
source venv/bin/activate
```

2. Install the required packages:
```
pip install opencv-python numpy matplotlib scikit-image pillow rembg
```

Note: If you're on Linux, you might need to install Tkinter separately:
```
# For Debian/Ubuntu
sudo apt-get install python3-tk

# For Fedora
sudo dnf install python3-tkinter

# For Arch Linux
sudo pacman -S tk
```

## Usage

1. Run the application:
```
python nir_enhancer.py
```

2. Using the application:
   - Click "Open Image" to load a NIR image
   - The application will automatically remove the background
   - Select an enhancement mode from the dropdown menu
   - Adjust the contrast and cluster parameters as needed
   - Click "Process Image" to apply the enhancements
   - Use "Show Histogram" to analyze intensity distribution
   - Save your enhanced image using "Save Enhanced Image"

## Enhancement Modes Explained

### Background Removed Only
Displays the original image with background removed but no additional enhancements.

### Basic Enhancement
Applies contrast stretching and Contrast Limited Adaptive Histogram Equalization (CLAHE) to improve visibility of details.

### Advanced Enhancement
Combines bilateral filtering with CLAHE and unsharp masking to reduce noise while enhancing edges and details.

### Segmentation
Uses K-means clustering to segment the image into distinct regions based on intensity values, useful for identifying different components in NIR imagery.

### False Color
Maps NIR intensity values to a color scale for better visualization of different intensities:
- Low reflectance (dark areas): Blue-Green
- Medium reflectance: Cyan-Blue
- High reflectance (typically vegetation in NIR): Yellow-Red

## Parameters

### Contrast
Adjusts the clip limit for CLAHE, controlling how much contrast enhancement is applied. Higher values produce more contrast but may introduce noise.

### Clusters
Controls the number of segments when using the Segmentation mode. More clusters create finer segmentation but may over-segment the image.

## Output
Enhanced images are saved in the "Saved_Images" directory with timestamps in the filename format: `nir_enhanced_YYYY-MM-DD_HH-MM-SS.jpg`

## Troubleshooting

### Common Issues:
- **Background removal fails**: Ensure the image has clear foreground/background separation
- **Application crashes during processing**: Try using smaller images or increase system memory
- **Image appears black after processing**: Check if the image was loaded correctly and try a different enhancement mode

### Error Messages:
- "No image loaded": You need to open an image before processing
- "Failed to remove background": The rembg library couldn't properly identify the foreground


## Credits
This application uses the following open-source packages:
- [OpenCV](https://opencv.org/)
- [NumPy](https://numpy.org/)
- [Matplotlib](https://matplotlib.org/)
- [scikit-image](https://scikit-image.org/)
- [Pillow](https://python-pillow.org/)
- [rembg](https://github.com/danielgatis/rembg)
