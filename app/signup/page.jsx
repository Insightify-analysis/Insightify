"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/form_label";
import { Input } from "@/components/ui/form_Input";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

import { LabelInputContainer } from "@/components/form-component";
import { Loader2 } from "lucide-react";

export default function UserSignup() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }) };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("token", data.token);
                router.push("/industry");
            }
            else setMessage(data.error || "Signup failed.")
        } catch (error) {
            setMessage("An unexpected error occurred.");
        } finally {
            setLoading(false);
            setFormData({ name: "", email: "", password: "" });
        }
    };

    const fields = [
        { id: "name", label: "Name", placeholder: "Tyler Durden", type: "text" },
        { id: "email", label: "Email", placeholder: "myemail@gmail.com", type: "email" },
        { id: "password", label: "Password", placeholder: "••••••••", type: "password" }
    ];

    return (
        <>
            <BackgroundBeamsWithCollision />
            <main className="bg-black min-h-screen flex items-center justify-center z-10">
                <div className="max-w-md w-full mx-auto rounded-3xl border-2 border-gray-50 border-opacity-30 md:rounded-2xl p-4 md:p-8  z-10">
                    <h2 className="font-bold text-neutral-200 text-xl">Welcome to Insightify</h2>
                    <form className="my-8 w-full flex items-center flex-col" onSubmit={handleSubmit}>
                        {fields.map(({ id, label, placeholder, type }) => (
                            <LabelInputContainer className="mb-4" key={id}>
                                <Label htmlFor={id}>{label}</Label>
                                <Input
                                    id={id}
                                    name={id}
                                    value={formData[id]}
                                    placeholder={placeholder}
                                    type={type}
                                    onChange={handleChange}
                                    required
                                />
                            </LabelInputContainer>
                        ))}

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-2 rounded-full relative bg-slate-900 text-white text-sm hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200 border border-slate-800 flex items-center justify-center gap-2">
                            <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-2xl bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent" />
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <span>Sign Up</span>
                            )}
                        </button>

                        <div className="bg-neutral-700 my-8 w-full h-[1px]" />
                        <p className="mr-2 font-mono text-sm text-white">
                            Already a user? <a href="/login" className="underline underline-offset-4">Login</a>
                        </p>
                        {message && <p className="text-red-400 mt-4">{message}</p>}
                    </form>
                </div>
            </main>
        </>
    );
}