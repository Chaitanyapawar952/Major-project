"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, LogIn, BrainCircuit } from "lucide-react";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, addUser } from "@/store/userSlice";
import UserDropdown from "./UserDropdown";
import CustomBtn from "./CustomBtn";
import toast from "react-hot-toast";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [isLoading,setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        let tempuser = {
          uid: user?.uid,
          displayName: user?.displayName,
          email: user?.email,
          photoURL: user?.photoURL,
        };
        dispatch(addUser(tempuser));
      } else {
        dispatch(clearUser());
      }
    });
    return () => unsubscribe();
  }, []);

  const navigationLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path) => pathname === path;
  const handleLogin = async ()=>{
    setIsLoading(true);
    try {
        await signInWithPopup(auth,new GoogleAuthProvider());
        toast.success("Login Successful")
    } catch (error) {
        console.log(error)
        toast.error(error?.message || "Some Error Occured")
    }finally{
      setIsLoading(false);
    }
  }
  return (
    <nav
      className="fixed w-full z-50 transition-all duration-300 backdrop-blur-lg border-b border-slate-700/[0.10]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-xl flex items-center font-bold text-theme-purple"
            >
              <div className="flex items-center gap-2">
                {/* <motion.span
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-3xl"
                > */}
                
                <h1 className="text-xl md:text-2xl font-bold ">
                  Your Logo
                </h1>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex md:flex-1 md:items-center md:justify-center">
            <div className="flex items-center space-x-4">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive(link.href)
                      ? "text-white bg-theme-purple shadow-md hover:shadow-lg"
                      : "text-gray-600  hover:bg-gray-100 "
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side items: Theme Toggle & Login */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
              aria-label="Toggle theme"
            >
              {mounted && theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button> */}

            {/* Login Link */}
            {!user ? (
              <CustomBtn
                onClick={handleLogin}
                className="flex items-center space-x-2 px-4 py-2 rounded-full text-base font-medium text-white bg-theme-purple hover:shadow-lg transition-all duration-300 mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </CustomBtn>
            ) : (
              <UserDropdown user={user}/>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-4 md:hidden">
            {/* <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
              aria-label="Toggle theme"
            >
              {mounted && theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button> */}
            {!user ? (
              <Link
                href="/login"
                className="cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-full text-base font-medium text-white bg-theme-purple hover:shadow-lg transition-all duration-300 mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
            ) : (
              <UserDropdown user={user}/>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-gray-600  hover:bg-gray-100  transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1  bg-white/90 backdrop-blur-md">
          {navigationLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`block px-4 py-2 rounded-full text-base font-medium transition-all duration-300 ${
                isActive(link.href)
                  ? "text-white bg-theme-purple shadow-md"
                  : "text-gray-600  hover:bg-gray-100 "
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Login Link in Mobile Menu */}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;