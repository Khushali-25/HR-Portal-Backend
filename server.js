const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser'); 
const Employee = require('./employee');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 5000;


mongoose.connect('mongodb+srv://admin:Honest2023@cluster0.ego5owt.mongodb.net/WindsonPayroll', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
});

const db = mongoose.connection;

const UserDetailsSchema = new mongoose.Schema({
  fname: String,
  email: { type: String, unique: true },
  password: String,
});















const User = mongoose.model('companyAdmin', UserDetailsSchema);


db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/api/register', async (req, res) => {
  const { fname, email, password } = req.body;

  // Check if password is provided and it's a non-empty string
  if (!password || typeof password !== 'string' || password.trim() === '') {
    return res.status(400).json({ error: 'Password is required and must be a non-empty string' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(400).json({ error: 'User already exists' });
    } else {
      const newUser = new User({
        email,
        password: encryptedPassword,
        fname,
      });
      await newUser.save();
      return res.status(201).json({ status: 'ok' });
    }
  } catch (error) {
    return res.status(500).json({ status: 'error' });
  }
});




app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        res.status(200).send({ status: 'ok', user: user });
      } else {
        res.status(401).send({ error: 'Invalid email or password' });
      }
    } else {
      res.status(404).send({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).send({ status: 'error' });
  }
});



// Create an API endpoint to add employees
app.post('/api/employees', async (req, res) => {
  const newEmployeeData = req.body;

  try {
    // Generate a unique ID using MongoDB
    const newEmployee = new Employee({
      ...newEmployeeData,
      _id: new mongoose.Types.ObjectId(),
    });

    await newEmployee.save();
    return res.status(201).json({ status: 'ok' });
  } catch (error) {
    return res.status(500).json({ status: 'error' });
  }
});






// Create an API endpoint to update employee information
app.put('/api/updateemployees/:employeeId', async (req, res) => {
  const employeeId = req.params.employeeId;
  const updatedEmployeeData = req.body;

  try {
    // Find the employee by ID and update their information
    const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, updatedEmployeeData, { new: true });

    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    return res.status(200).json(updatedEmployee);
  } catch (error) {
    return res.status(500).json({ status: 'error' });
  }
});


















