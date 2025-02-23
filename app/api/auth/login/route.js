import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        // Check if user exists
        const query = "SELECT * FROM users WHERE email = $1";
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            return Response.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const user = result.rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return Response.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return Response.json({ token, user: { id: user.id, name: user.name, email: user.email } }, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Login failed" }, { status: 500 });
    }
}