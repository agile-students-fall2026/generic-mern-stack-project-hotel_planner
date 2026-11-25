// import and instantiate express
import express from 'express'; // ES module import style
import session from 'express-session';
import crypto from 'crypto';
const app = express(); // instantiate an Express object

import initialSearchHotels from './mockData/hotelList.js';
import initialSavedHotels from './mockData/savedHotels.js';
import stayedHotels from './mockData/stayedHotels.js';
import initialBookings from './mockData/currentBooking.js';
import hotelList from './mockData/hotelList.js';
import initialUsers from './mockData/users.js';

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()); // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })); // decode url-encoded incoming POST data

// make 'public' directory publicly readable with static content
app.use('/static', express.static('public'));

//NOTE: Above code is taken from SWE sample/example code from https://github.com/nyu-software-engineering/express-js-starter-app/blob/master/app.js

// =====Sign Up and Sign In ======
let users = initialUsers.map((user) => ({ ...user })); //temporary Data base
let highestId = 0;
for (const u of users) {
  if (Number(u.id) > highestId) {
    highestId = Number(u.id);
  }
}

app.post('/api/auth/signup', (req, res) => {
  const user = req.body || {};
  if (!user.email || !user.password) {
    const body = { error: 'Email and password are required' };
    res.status(400);
    res.json(body);
    return;
  }

  const alreadyExists = users.find((u) => u.email === user.email);
  if (alreadyExists) {
    const body = { error: 'An account with that email already exists' };
    res.status(400);
    res.json(body);
    return;
  }

  highestId += 1;
  const newUser = {
    id: String(highestId), //WILL CHANGE USER ID TO BE EMAIL LATER INSTEAD OF JUST A NUMBER
    email: user.email,
    password: user.password,
  };
  users.push(newUser);
  const body = {
    message: 'Sign up successful',
    user: { id: newUser.id, email: newUser.email },
  };
  res.status(201);
  res.json(body);
});
// =====Sign Up Sign In End=====

// ===== USER AUTHENTICATION =====

// Session configuration
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || 'hotel-planner-local-development-only',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  }),
);

// Mock user for development and testing only
//let users = initialUsers.map((user) => ({ ...user })); //temporary Data base

// Login API
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required',
    });
  }

  const user = users.find((u) => u.email === email);
  if (!user || user.password !== password) {
    return res.status(401).json({
      error: 'Invalid email or password',
    });
  }

  req.session.regenerate((err) => {
    if (err) {
      return res.status(500).json({
        error: 'Unable to create login session',
      });
    }

    req.session.userId = user.id;

    return res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
      },
    });
  });
});

// Check authentication status
app.get('/api/auth/me', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      error: 'Not authenticated',
    });
  }

  return res.json({
    authenticated: true,
    user: {
      id: req.session.userId,
      email: users.find((u) => u.id === req.session.userId)?.email,
    },
  });
});

// Logout API
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        error: 'Logout failed',
      });
    }

    res.clearCookie('connect.sid');
    return res.json({
      message: 'Logged out successfully',
    });
  });
});

// ===== USER AUTHENTICATION END =====

// ===== SAVED HOTELS =====

// this is mock data, it is stored in the mock data folder
let savedHotels = initialSavedHotels.map((hotel) => ({ ...hotel })); //CURRENTLY CAN NOT CHANGE THE MOCK DATA ARRAY. WILL
//DIRECTLY CHANGE DATABASE DATA WHEN GETTING A DATABASE
//(this array will act as a temporary db,
//but gets reset between backend server restarts)
app.get('/api/saved', (req, res) => {
  //get all saved hotels
  res.json(savedHotels);
});

app.post('/api/saved', (req, res) => {
  //update hotels in saved list
  const hotel = req.body || {};
  if (!hotel.id || !hotel.name) {
    const body = { error: 'hotel must have an id and name' };
    res.status(400);
    res.json(body);
    return;
  }

  const alreadySaved = savedHotels.find((h) => h.id === String(hotel.id));
  if (alreadySaved) {
    res.json(alreadySaved);
    return;
  }

  const newHotel = {
    id: String(hotel.id),
    name: hotel.name || '',
    location: hotel.location || '',
    date: hotel.date || '',
    description: hotel.description || '',
    imageSrc: hotel.imageSrc || '', //should change this later to match an image source for google places
  };
  savedHotels.push(newHotel);
  res.status(200);
  res.json(newHotel);
});

app.post('/api/saved/:id', (req, res) => {
  //update specific hotel details
  const hotel = savedHotels.find((h) => h.id === req.params.id);
  if (!hotel) {
    const body = { error: 'Saved hotel not found' };
    res.status(404);
    res.json(body);
    return;
  }

  const { description } = req.body || {};
  if (typeof description !== 'string') {
    const body = { error: 'description must be string type' };
    res.status(400);
    res.json(body);
    return;
  }

  hotel.description = description;
  res.json(hotel);
});

app.delete('/api/saved/:id', (req, res) => {
  const hotel = savedHotels.find((h) => h.id === req.params.id);
  if (!hotel) {
    const body = { error: 'Saved hotel not found' };
    res.status(404);
    res.json(body);
    return;
  }

  savedHotels = savedHotels.filter((h) => h.id !== req.params.id);
  const body = { message: 'Deleted', id: req.params.id };
  res.json(body);
});
// ===== SAVED HOTELS END =====

// ===== PROFILE =====
app.get('/api/profile/stays', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      error: 'Not authenticated',
    });
  }

  const userStays = stayedHotels
    .filter((stay) => stay.userId === req.session.userId)
    .map((stay) => {
      const hotel = initialSearchHotels.find((h) => h.id === stay.hotelId);
      return {
        id: stay.id,
        userId: stay.userId,
        hotelId: stay.hotelId,
        hotel: hotel ? hotel.name : 'Unknown hotel',
        city: hotel ? hotel.location : '',
        date: stay.date,
      };
    });
  return res.json(userStays);
});
// ===== PROFILE END =====

// ===== CURRENT BOOKINGS START =====
let bookings = initialBookings.map((booking) => ({ ...booking })); //CURRENTLY CAN NOT CHANGE THE MOCK DATA ARRAY. WILL
//DIRECTLY CHANGE DATABASE DATA WHEN GETTING A DATABASE
//(this array will act as a temporary db,
//but gets reset between backend server restarts)

app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

app.post('/api/bookings', (req, res) => {
  //add to current booking
  const hotel = req.body || {};
  if (!hotel.id || !hotel.name) {
    const body = { error: 'booking must have an id and name' };
    res.status(400);
    res.json(body);
    return;
  }

  const alreadyBooked = bookings.find((b) => b.id === String(hotel.id));
  if (alreadyBooked) {
    res.json(alreadyBooked);
    return;
  }

  const newBooking = {
    id: String(hotel.id),
    name: hotel.name || '',
    location: hotel.location || '',
    checkIn: hotel.checkIn || '',
    checkOut: hotel.checkOut || '',
    checkInTime: hotel.checkInTime || '',
    checkOutTime: hotel.checkOutTime || '',
    description: hotel.description || '',
    imageSrc: hotel.imageSrc || '', //should change this later to match an image source for google places
  };
  bookings.push(newBooking);
  res.status(200);
  res.json(newBooking);
});

app.post('/api/bookings/:id', (req, res) => {
  //update a booking's notes and dates
  const booking = bookings.find((b) => b.id === req.params.id);
  if (!booking) {
    const body = { error: 'Booking not found' };
    res.status(404);
    res.json(body);
    return;
  }

  const { description, checkIn, checkOut, checkInTime, checkOutTime } =
    req.body || {};
  if (
    typeof description !== 'string' ||
    typeof checkIn !== 'string' ||
    typeof checkOut !== 'string'
  ) {
    const body = {
      error: 'description, checkIn, and checkOut must be string type',
    };
    res.status(400);
    res.json(body);
    return;
  }

  booking.description = description;
  booking.checkIn = checkIn;
  booking.checkOut = checkOut;
  booking.checkInTime = checkInTime;
  booking.checkOutTime = checkOutTime;
  res.json(booking);
});

app.delete('/api/bookings/:id', (req, res) => {
  //remove a booking
  const booking = bookings.find((b) => b.id === req.params.id);
  if (!booking) {
    const body = { error: 'Booking not found' };
    res.status(404);
    res.json(body);
    return;
  }

  bookings = bookings.filter((b) => b.id !== req.params.id);
  const body = { message: 'Deleted', id: req.params.id };
  res.json(body);
});
// ===== CURRENT BOOKINGS END =====

//this function is for the search feature
app.get('/api/hotels/search', (req, res) => {
  const q = req.query.q;

  if (typeof q !== 'string' || !q.trim()) {
    return res.status(400).json({ error: 'Enter a hotel name or location' });
  }

  const keyword = q.trim().toLowerCase();
  const hotels = hotelList.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(keyword) ||
      hotel.location.toLowerCase().includes(keyword),
  );

  return res.json({ hotels });
});

app.get('/api/hotels/:id', (req, res) => {
  const hotel = hotelList.find((item) => item.id === req.params.id);

  if (!hotel) {
    return res.status(404).json({ error: 'Hotel not found' });
  }

  return res.json({ hotel });
});

// ===== Forgot / Reset Password =====
let resetTokens = [];
const RESET_TOKEN_EXPIRATION = 15 * 60 * 1000;

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body || {};

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const genericResponse = {
    message: 'If an account exists for that email, a reset link has been sent.',
  };

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.json(genericResponse);
  }

  resetTokens = resetTokens.filter((t) => t.email !== user.email);
  const token = crypto.randomBytes(20).toString('hex');
  resetTokens.push({
    email: user.email,
    token,
    expiresAt: Date.now() + RESET_TOKEN_EXPIRATION,
  });

  // TODO: email this link once we have an email service
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;

  if (process.env.NODE_ENV !== 'production') {
    console.log(`Password reset link for ${user.email}: ${resetLink}`);
    return res.json({
      ...genericResponse,
      devToken: token,
      devResetLink: resetLink,
    });
  }

  return res.json(genericResponse);
});

app.post('/api/auth/reset-password', (req, res) => {
  const { token, newPassword } = req.body || {};

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ error: 'Token and new password are required' });
  }

  const record = resetTokens.find((t) => t.token === token);
  if (!record || record.expiresAt < Date.now()) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }

  const user = users.find((u) => u.email === record.email);
  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }

  user.password = newPassword;
  resetTokens = resetTokens.filter((t) => t.token !== token);

  return res.json({ message: 'Password has been reset successfully' });
});

// ===== Forgot / Reset Password END =====

// export the express app we created to make it available to other modules
export default app;
