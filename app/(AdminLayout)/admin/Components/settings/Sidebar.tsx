// "use client";

// import { ReactNode, useContext, useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import Image from "next/image";
// // import { UserContext } from "@/context/UserContext";
// // import Modal from "../ui/Modal";
// // import UserButton from "../ui/UserButton";
// import axios from "axios";
// import NavItem from "./NavItem";

// const Sidebar = () => {
//   const pathname = usePathname();
//   // const { user, logout } = useContext(UserContext);
//   const [isOpen, setIsOpen] = useState(false);
//   const handleOpen = () => setIsOpen(true);
//   const handleClose = () => setIsOpen(false);
//   const router = useRouter();
//   const handleDeleteAccount = async () => {
//     try {
//       const token = localStorage.getItem("auth-token"); // or retrieve from cookies/context

//       if (!token) {
//         console.error("No token found");
//         return;
//       }

//       const response = await axios.delete("/api/user/auth/delete", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log("User deleted:", response.data);

//       router.push("/auth/login");
//     } catch (error: any) {
//       console.error(
//         "Error deleting user:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   return (
//     <div className="bg-white rounded-tl-2xl rounded-bl-2xl py-2 hidden lg:block mt-8">
//       <div className="flex flex-col items-center mb-6 px-10">
//         <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-xl font-bold text-white">
//           {user?.avatar ? (
//             <img
//               src={user.avatar}
//               alt="User Avatar"
//               className="w-full h-full rounded-full object-cover"
//             />
//           ) : (
//             <span className="text-2xl">
//               ali
//             </span>
//           )}
//         </div>
//         <p className="mt-2 font-semibold ">{user?.username}</p>
//         <p className="p3 /40">{user?.email}</p>
//       </div>
//       <hr className="mb-5 /10 border-[1px] mx-4" />
//       <nav className="space-y-4 px-10">
//         <NavItem
//           icon={
//             <Image
//               src="/images/settings/Edit.svg"
//               alt="Edit Profile"
//               width={24}
//               height={24}
//             />
//           }
//           text="Edit Profile"
//           href={user?.isAdmin === true ? "/admin/settings" : "/settings"}
//           isActive={
//             pathname === (user?.isAdmin === true ? "/admin/settings" : "/settings")
//           }
//         />
//         <NavItem
//           icon={
//             <Image
//               src="/images/settings/Lock.svg"
//               alt="Change Password"
//               width={24}
//               height={24}
//             />
//           }
//           text="Change Password"
//           href={
//             user?.isAdmin === true
//               ? "/admin/settings/change-password"
//               : "/settings/change-password"
//           }
//           isActive={
//             pathname ===
//             (user?.isAdmin === true
//               ? "/admin/settings/change-password"
//               : "/settings/change-password")
//           }
//         />

//         {user?.isAdmin !== true && (
//           <>
//             <button
//               onClick={handleOpen}
//               className="flex items-center gap-2 text-left w-full cursor-pointer transition-colors mb-4  hover:text-primary"
//             >
//               <Image
//                 src="/images/settings/Delete.svg"
//                 alt="Delete Account"
//                 width={24}
//                 height={24}
//               />
//               <span className="h5">Delete Account</span>
//             </button>

//             <Modal isOpen={isOpen} onClose={handleClose}>
//               <div className="text-center">
//                 <Image
//                   src="/images/Modal/delete.svg"
//                   alt="Delete Account"
//                   width={141}
//                   height={141}
//                   className="mx-auto mb-4"
//                 />
//                 <h4 className="h4 font-bold mb-2">Delete Account?</h4>
//                 <p className="p3 /50">
//                   Are you sure you want to delete your account? All account details
//                   will be deleted.
//                 </p>
//               </div>
//               <div className="flex flex-row justify-center gap-3 mt-6">
//                 <UserButton
//                   variant="white"
//                   onClick={handleClose}
//                   className="mt-4 bg-[#F5F5F5] /50 px-7 py-2 rounded-lg"
//                 >
//                   Cancel
//                 </UserButton>
//                 <UserButton
//                   variant="danger"
//                   onClick={handleDeleteAccount}
//                   className="mt-4 text-white px-7 py-2 rounded-lg"
//                 >
//                   Delete
//                 </UserButton>
//               </div>
//             </Modal>
//           </>
//         )}

//         <button
//           onClick={() => logout()}
//           className="flex items-center gap-2 text-left w-full cursor-pointer transition-colors mb-4  hover:text-primary"
//         >
//           <Image
//             src="/images/settings/Logout.svg"
//             alt="Logout"
//             width={24}
//             height={24}
//           />
//           <span className="h5">Logout</span>
//         </button>
//       </nav>

//     </div>
//   );
// };

// export default Sidebar;

"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import NavItem from "./NavItem";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteAccount = () => {
    alert("Delete account functionality not yet implemented.");
  };

  const handleLogout = () => {
    alert("Logout functionality not yet implemented.");
    router.push("/auth/login");
  };

  return (
    <div className="bg-white rounded-tl-2xl rounded-bl-2xl py-2 hidden lg:block mt-8">
      {/* --- USER PROFILE SECTION --- */}
      <div className="flex flex-col items-center mb-6 px-10">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-xl font-bold text-white">
          <span className="text-2xl">G</span>
        </div>
        <p className="mt-2 font-semibold ">Guest User</p>
        <p className="p3 /40">guest@example.com</p>
      </div>

      <hr className="mb-5 /10 border-[1px] mx-4" />

      {/* --- NAVIGATION --- */}
      <nav className="space-y-4 px-10">
        <NavItem
          inactiveIcon={
            <Image
              src="/admin-images/settings/edit.svg"
              alt="Edit Profile"
              width={24}
              height={24}
            />
          }
          activeIcon={
            <Image
              src="/admin-images/settings/edit-active.svg"
              alt="Edit Profile"
              width={24}
              height={24}
            />
          }
          text="Edit Profile"
          href="/admin/settings/editProfile"
          isActive={pathname === "/admin/settings/editProfile"}
        />

        <NavItem
          inactiveIcon={
            <Image
              src="/admin-images/settings/password.svg"
              alt="Edit Profile"
              width={24}
              height={24}
            />
          }
          activeIcon={
            <Image
              src="/admin-images/settings/password-active.svg"
              alt="Edit Profile"
              width={24}
              height={24}
            />
          }
          text="Change Password"
          href="/admin/settings/changePassword"
          isActive={pathname === "/admin/settings/changePassword"}
        />

        <NavItem
          inactiveIcon={
            <Image
              src="/admin-images/settings/promotions.svg"
              alt="Edit Profile"
              width={24}
              height={24}
            />
          }
          activeIcon={
            <Image
              src="/admin-images/settings/promotions-active.svg"
              alt="Edit Profile"
              width={24}
              height={24}
            />
          }
          text="Promotions"
          href="/settings/change-password"
          isActive={pathname === "/settings/change-password"}
        />
        <NavItem
          inactiveIcon={
            <Image
              src="/admin-images/settings/payment.svg"
              alt="Edit Profile"
              width={24}
              height={24}
            />
          }
          activeIcon={
            <Image
              src="/admin-images/settings/payment-active.svg"
              alt="Edit Profile"
              width={24}
              height={24}
            />
          }
          text="Payment Management"
          href="/settings/change-password"
          isActive={pathname === "/settings/change-password"}
        />

        {/* DELETE ACCOUNT */}
        <button
          onClick={handleDeleteAccount}
          className="flex items-center gap-2 text-left w-full cursor-pointer transition-colors mb-4  hover:text-primary"
        >
          <Image
            src="/images/settings/Delete.svg"
            alt="Delete Account"
            width={24}
            height={24}
          />
          <span className="h5">Delete Account</span>
        </button>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-left w-full cursor-pointer transition-colors mb-4  hover:text-primary"
        >
          <Image
            src="/images/settings/Logout.svg"
            alt="Logout"
            width={24}
            height={24}
          />
          <span className="h5">Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
