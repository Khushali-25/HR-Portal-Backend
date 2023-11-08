const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser'); 

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

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      res.send({ error: 'User already exists' });
    } else {
      const newUser = new User({
        email,
        password: encryptedPassword,
        fname,
      });
      await newUser.save();
      res.send({ status: 'ok' });
    }
  } catch (error) {
    res.send({ status: 'error' });
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

app.post('/api/employees', async (req, res) => {
  const employeeData = req.body;

  const encryptedPassword = await bcrypt.hash(employeeData.companyPassword, 10);
  try {
    const oldEmployee = await Employee.findOne({ companyEmail: employeeData.companyEmail });
    if (oldEmployee) {
      res.send({ error: 'Employee already exists' });
    } else {
      const newEmployee = new Employee({
        ...employeeData,
        companyPassword: encryptedPassword,
      });
      await newEmployee.save();
      res.send({ status: 'ok' });
    }
  } catch (error) {
    res.send({ status: 'error' });
  }
});



















