import { expect } from 'chai';
import request from 'supertest';
import app from '../app.js';

describe('Password Reset API', function () {
    const email = 'reset_test@hotelplanner.com';
    const validEmail = 'test@hotelplanner.com';

    describe('POST /api/auth/forgot-password', function () {
        it ('requires an email', async function () {
            const response = await request(app)
                .post('/api/auth/forgot-password')
                .send({ email: '' });

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal('Email is required');
        });

        it ('sends a reset link for a email', async function () {
            const response = await request(app)
                .post('/api/auth/forgot-password') 
                .send({ email });

            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('If an account exists for that email, a reset link has been sent.');
        });

        it ('returns dev token for valid account', async function () {
            const response = await request(app)
                .post('/api/auth/forgot-password')
                .send({ email: validEmail });

            expect(response.status).to.equal(200);
            expect(response.body.devResetLink).to.be.a('string');
        });
    });

    describe('POST /api/auth/reset-password', function () {
        const resetEmail = 'reset_flow@hotelplanner.com';

        before(async function () {
        await request(app)
            .post('/api/auth/signup')
            .send({ email: resetEmail, password: 'oldpass' });
        });

        const getToken = async () => {
            const response = await request(app)
                .post('/api/auth/forgot-password')
                .send({ email: resetEmail });
                return response.body.devToken;
        };

        it ('requires a token and new password', async function () {
            const response = await request(app)
                .post('/api/auth/reset-password')
                .send({ token: '', newPassword: '' });

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal('Token and new password are required');
        });

        it ('rejects an invalid token', async function () {
            const response = await request(app)
                .post('/api/auth/reset-password')
                .send({ token: 'invalidtoken', newPassword: 'newpassword123' });

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal('Invalid or expired token');
        });

        it ('resets the password with a valid token', async function () {
            const token = await getToken();

            const response = await request(app)
                .post('/api/auth/reset-password')
                .send({ token, newPassword: 'newpassword123' });

            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Password has been reset successfully');

            const login = await request(app)
                .post('/api/auth/login')
                .send({ email: resetEmail, password: 'newpassword123' });
            expect(login.status).to.equal(200);

            const oldLogin = await request(app)
                .post('/api/auth/login')
                .send({ email: resetEmail, password: 'oldpass' });
            expect(oldLogin.status).to.equal(401);
        });

        it ('rejects a token that was already used', async function () {
            const token = await getToken();

            const response = await request(app)
                .post('/api/auth/reset-password')
                .send({ token, newPassword: 'newpassword123' });

            expect(response.status).to.equal(200);

            const secondResponse = await request(app)
                .post('/api/auth/reset-password')
                .send({ token, newPassword: 'newpassword456' });

            expect(secondResponse.status).to.equal(400);
            expect(secondResponse.body.error).to.equal('Invalid or expired token');
        });

        it ('invalidates old token after new one is requested', async function () {
            const oldToken = await getToken();
            const newToken = await getToken();

            const oldResponse = await request(app)
                .post('/api/auth/reset-password')
                .send({ token: oldToken, newPassword: 'whatever' });
            expect(oldResponse.status).to.equal(400);

            const newResponse = await request(app)
                .post('/api/auth/reset-password')
                .send({ token: newToken, newPassword: 'whatever' });
            expect(newResponse.status).to.equal(200);
        });

        it ('rejects an expired token', async function () {
            const token = await getToken();

            const realNow = Date.now;
            Date.now = () => realNow() + 16 * 60 * 1000;

            try {
                const response = await request(app)
                    .post('/api/auth/reset-password')
                    .send({ token, newPassword: 'toolate' });

                expect(response.status).to.equal(400);
                expect(response.body.error).to.equal('Invalid or expired token');
            } finally {
                Date.now = realNow;
            }
        });
    });
});