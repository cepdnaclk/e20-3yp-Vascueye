const controller = require('../controllers/userController');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const FlapData = require('../models/FlapData');

jest.mock('../models/Patient');
jest.mock('../models/Doctor');
jest.mock('../models/FlapData');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('User Controller - getPatients', () => {
  it('should return list of patients', async () => {
    const patients = [{ name: 'Alice' }, { name: 'Bob' }];
    Patient.find.mockResolvedValue(patients);

    const req = {};
    const res = mockRes();

    await controller.getPatients(req, res);

    expect(Patient.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(patients);
  });

  it('should handle error', async () => {
    Patient.find.mockRejectedValue(new Error('Database error'));

    const req = {};
    const res = mockRes();

    await controller.getPatients(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Server error',
      details: 'Database error',
    });
  });
});

describe('User Controller - registerDoctor', () => {
  it('should create a doctor successfully', async () => {
    const req = {
      body: {
        name: 'Dr. John',
        email: 'john@example.com',
        specialty: 'Neurology',
        contact: '1234567890',
        age: 45,
      },
    };
    Doctor.findOne.mockResolvedValue(null);
    Doctor.prototype.save = jest.fn().mockResolvedValue();

    const res = mockRes();
    await controller.registerDoctor(req, res);

    expect(Doctor.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Doctor registered successfully',
        doctor: expect.any(Object),
      })
    );
  });

  it('should not register doctor with invalid email', async () => {
    const req = {
      body: {
        name: 'Dr. Invalid',
        email: 'invalidemail',
        specialty: 'Dermatology',
        contact: '1234567890',
        age: 50,
      },
    };
    const res = mockRes();
    await controller.registerDoctor(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid email format',
    });
  });
});
