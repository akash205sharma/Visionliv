"use client"
import InputField from "@/components/InputField";
import { useEffect, useState } from "react";
import { useSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import { Divide } from "lucide-react";

const login = () => {

    const router = useRouter();
    const sessionContext = useSession();
    const session = sessionContext?.session;
    const setSession = sessionContext?.updateSession;
    const [invalid, setInvalid] = useState(false)

    useEffect(() => {
        if (session?.status === "logged") {
            router.push("/")
        }
    }, [session])


    useEffect(() => {
        // Read token from cookies
        const token = document.cookie
            .split("; ")
            .find(row => row.startsWith("token="))
            ?.split("=")[1];

        if (token) {
            router.push("/login"); // Redirect if token exists
        }
    }, [session]);

    const [islogin, setIslogin] = useState(1);

    const [user, setUser] = useState({
        'username': "",
        'name': '',
        'email': '',
        'password': '',
        'ishost': false,
    })


    async function handleSubmit() {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/auth/${islogin ? "login" : "signup"}`

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(user),
            })
            if (res.ok) {

                const data = await res.json();
                console.log(data);

                if (data.userData.status == "logged") {
                    router.push("/");
                    console.log("Logged in")
                    setSession(data.userData);

                }
                setUser({ 'username': "", 'name': '', 'email': "", 'password': '', ishost: false });
            }
            else setInvalid(true)

        } catch (error) {
            console.error(error);
        }
    }



    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }))

    }



    return (
        <div className="relative flex items-center justify-center bg-gray-100 px-4 h-[calc(100vh-120px)] w-full ">
            <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-6">
                {/* Toggle Buttons */}
                <div className="flex justify-center mb-6">
                    <button
                        onClick={() => setIslogin(1)}
                        className={`w-1/2 py-2 text-center rounded-t-xl ${islogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIslogin(0)}
                        className={`w-1/2 py-2 text-center rounded-t-xl ${!islogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Auth Content */}
                <div className="space-y-4">

                    {invalid ?
                        <div className="text-red-600" >Invalid details</div> :null}

                    {/* Input Fields */}
                    <div className="space-y-4">
                        {!islogin && (
                            <>
                                <div className="flex gap-2">
                                    <InputField
                                        label="Username"
                                        name="username"
                                        value={user.username}
                                        onChange={handleChange}
                                        placeholder="you@name"
                                    />
                                    <InputField
                                        label="Full Name"
                                        name="name"
                                        value={user.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <InputField
                                    label="Email Address"
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                />
                            </>
                        )}

                        {islogin ? (
                            <InputField
                                label="Username"
                                name="username"
                                value={user.username}
                                onChange={handleChange}
                                placeholder="you@name"
                            />
                        ) : null}
                        <InputField
                            label="Password"
                            name="password"
                            type="password"
                            value={user.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                        />
                        <p className="text-xs text-gray-400">
                            At least 8 characters with numbers and symbols.
                        </p>
                    </div>

                    {/* Become host */}
                    {
                        !islogin &&
                        <div className="flex items-center gap-2">
                            <input
                                onChange={() => {
                                    setUser(prevUser => ({
                                        ...prevUser,
                                        ishost: !prevUser.ishost
                                    }))
                                }}
                                type="checkbox" name="ishost" checked={user.ishost} className="h-4 w-4" />

                            <label htmlFor="remember" className="text-sm text-gray-600">
                                Become host
                            </label>
                        </div>
                    }

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold transition"
                    >
                        {islogin ? 'Login' : 'Create Account'}
                    </button>
                </div>
            </div>
        </div>

    )
}

export default login


