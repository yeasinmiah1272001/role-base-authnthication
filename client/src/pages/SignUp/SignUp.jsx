import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import toast from "react-hot-toast";
import { TbFidgetSpinner } from "react-icons/tb";

const SignUp = () => {
  const { createUser, updateUserProfile, loading, signInWithGoogle } =
    useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value; // Fixed incorrect field reference
    const password = form.password.value;
    const image = form.image.files[0];
    const formData = new FormData();
    formData.append("image", image);

    try {
      // Upload image to imgbb
      const { data } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API}`,
        formData
      );

      const imageUrl = data.data.display_url;

      // Create user and update profile
      const result = await createUser(email, password);
      await updateUserProfile(name, imageUrl);
      toast.success("user sign up success");
      navigate("/");

      // console.log("User created successfully:", result);
    } catch (error) {
      console.error("Error during sign up:", error.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      toast.success("Google Login success");
      navigate("/");
    } catch (error) {
      console.error("Error during sign up:", error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-100 text-gray-900">
        <div className="mb-8 text-center">
          <h1 className="my-3 text-4xl font-bold">Sign Up</h1>
          <p className="text-sm text-gray-400">Welcome to StayVista</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 ng-untouched ng-pristine ng-valid"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter Your Name Here"
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
                required
              />
            </div>
            <div>
              <label htmlFor="image" className="block mb-2 text-sm">
                Select Image:
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                className="w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter Your Email Here"
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter a secure password"
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="bg-rose-500 w-full rounded-md py-3 text-white"
          >
            {loading ? (
              <TbFidgetSpinner
                size={20}
                className="animate-spin text-center justify-center m-auto "
              />
            ) : (
              "Continue"
            )}
          </button>
        </form>
        <div className="flex items-center pt-4 space-x-1">
          <div className="flex-1 h-px sm:w-16 bg-gray-300"></div>
          <p className="px-3 text-sm text-gray-500">
            Signup with social accounts
          </p>
          <div className="flex-1 h-px sm:w-16 bg-gray-300"></div>
        </div>
        <div
          onClick={handleGoogle}
          className="flex justify-center items-center space-x-2 border m-3 p-2 border-gray-300 rounded cursor-pointer"
        >
          <FcGoogle size={32} />
          <p>Continue with Google</p>
        </div>
        <p className="px-6 text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="hover:underline hover:text-rose-500 text-gray-600"
          >
            Login
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default SignUp;
