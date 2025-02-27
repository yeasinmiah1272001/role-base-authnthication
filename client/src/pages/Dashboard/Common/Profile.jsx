import useAuth from "../../../hooks/useAuth";
import { Helmet } from "react-helmet-async";
import useRole from "../../../hooks/useRole";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";

const Profile = () => {
  const { user } = useAuth();
  const [role, isLoading] = useRole();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="flex justify-center items-center mx-auto w-full p-6">
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md overflow-hidden">
        <img
          alt="profile background"
          src="https://wallpapercave.com/wp/wp10784415.jpg"
          className="w-full h-36 object-cover"
        />
        <div className="relative -mt-16 flex flex-col items-center">
          <img
            alt="user avatar"
            src={user?.photoURL}
            className="rounded-full h-24 w-24 border-4 border-white shadow-md"
          />
          <p className="mt-4 px-4 py-1 text-sm text-white bg-pink-500 rounded-full shadow">
            {role}
          </p>
          <p className="mt-2 text-lg font-semibold text-gray-800">
            User ID: {user?.uid}
          </p>
        </div>
        <div className="p-6">
          <div className="text-center space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium">Name</p>
                <p className="text-black font-semibold">{user?.displayName}</p>
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-black font-semibold">{user?.email}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-6">
              <button className="bg-pink-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-pink-600 transition">
                Update Profile
              </button>
              <button className="bg-pink-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-pink-600 transition">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
