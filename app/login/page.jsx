"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/form_label";
import { Input } from "@/components/ui/form_Input";
import { LabelInputContainer } from "@/components/form-component";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Loader2 } from "lucide-react";

export default function UserLogin() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                router.push("/home");
            } else {
                setMessage(data.error || "Login failed.");
            }
        } catch (error) {
            setMessage("An unexpected error occurred.");
        } finally {
            setLoading(false);
            setFormData({ email: "", password: "" });
        }
    };

    return (
        <>
            <BackgroundBeamsWithCollision />
            <main className="bg-black min-h-screen flex items-center justify-center z-10">
                <div className="shadow-input mx-auto p-8 w-full max-w-md z-10 shadow-sm shadow-white">
                    <h2 className="font-bold text-neutral-200 text-xl">Welcome Back to Insightify</h2>
                    <form className="my-8 w-full flex items-center flex-col" onSubmit={handleSubmit}>
                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                value={formData.email}
                                placeholder="myemail@gmail.com"
                                type="email"
                                onChange={handleChange}
                                required
                            />
                        </LabelInputContainer>

                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                value={formData.password}
                                placeholder="••••••••"
                                type="password"
                                onChange={handleChange}
                                required
                            />
                        </LabelInputContainer>
                        <button
                            className="px-8 py-2 rounded-full relative bg-slate-900 text-white text-sm hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200 border border-slate-800 flex items-center justify-center gap-2"
                            type="submit"
                            disabled={loading}
                        >
                            <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-2xl bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent" />
                            <span className="relative z-20">
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <span>Login</span>
                                )}
                            </span>
                        </button>

                        <div className="bg-neutral-700 my-8 w-full h-[1px]" />
                        <p className="mr-2 font-mono text-sm text-white">
                            New here? <a href="/signup" className="underline underline-offset-4">Sign Up</a>
                        </p>
                        {message && <p className="text-red-400 mt-4">{message}</p>}
                    </form>
                </div>
            </main>
        </>
    );
}