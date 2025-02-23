import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        // Check if email already exists
        const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);

        if (existingUser.rowCount > 0) {
            return Response.json({ error: "Email already in use" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into database
        const query = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email";
        const values = [name, email, hashedPassword];

        const result = await pool.query(query, values);
        const user = result.rows[0];

        // Generate JWT token
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return Response.json({ token, user }, { status: 201 });
    } catch (error) {
        console.error(error);
        return Response.json({ error: "User registration failed" }, { status: 500 });
    }
}