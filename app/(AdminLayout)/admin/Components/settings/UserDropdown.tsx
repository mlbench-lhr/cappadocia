// import React, { useContext, useState } from "react";
// import ClickOutside from "./ClickOutside";
// import Link from "next/link";
// import { UserContext } from "@/context/UserContext";
// import Image from "next/image";
// import NavItem from "./NavItem";
// import { usePathname, useRouter } from "next/navigation";
// import UserButton from "../ui/UserButton";
// import Modal from "../ui/Modal";
// import axios from "axios";

// const UserDropdown = () => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const { user, logout } = useContext(UserContext);
//   const pathname = usePathname();
//   const handleOpen = () => setIsOpen(true);
//   const handleClose = () => setIsOpen(false);
//   const router = useRouter();

//   const handleDeleteAccount = async () => {
//     try {
//       const token = localStorage.getItem("auth-token"); 

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
//     <div className="lg:hidden block z-10 border-0">
//       <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
//         <Link
//           onClick={() => setDropdownOpen(!dropdownOpen)}
//           className="flex items-center gap-4"
//           href="#"
//         >
//           <span className=" text-right ">
//             <p className="block text-black dark:text-white">{user?.username}</p>
//             {/* <span className="block text-xs">UX Designer</span> */}
//           </span>

//           {user?.image ? (
//             <div className="w-[44px] h-[44px] rounded-full overflow-hidden flex-shrink-0">
//               <Image
//                 width={44}
//                 height={44}
//                 src={`${process.env.NEXT_PUBLIC_SITE_URL}${user.image}`}
//                 className="object-cover w-full h-full"
//                 alt="User"
//               />
//             </div>
//           ) : (
//             <div className="w-[44px] h-[44px] text-[26.86px] flex items-center justify-center bg-[#F2F2F2] rounded-full text-[#266CA8] font-bold">
//               {user?.username?.charAt(0).toUpperCase()}
//             </div>
//           )}

//           <svg
//             className="fill-current "
//             width="12"
//             height="8"
//             viewBox="0 0 12 8"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               fillRule="evenodd"
//               clipRule="evenodd"
//               d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
//               fill=""
//             />
//           </svg>
//         </Link>

//         {/* <!-- Dropdown Start --> */}
//         {dropdownOpen && (
//           <div
//             className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-secondary/10 bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
//           >
//             <ul className="flex flex-col gap-5 border-b border-secondary/10 px-3 py-3 dark:border-strokedark">
//               <li>
//                 <NavItem
//                   icon={
//                     <Image
//                       src="/images/settings/Edit.svg"
//                       alt="Edit Profile"
//                       width={24}
//                       height={24}
//                     />
//                   }
//                   text="Edit Profile"
//                   href="/settings"
//                   isActive={pathname === "/settings"}
//                 />
//               </li>
//               <li>
//                 <NavItem
//                   icon={
//                     <Image
//                       src="/images/settings/Lock.svg"
//                       alt="Change Password"
//                       width={24}
//                       height={24}
//                     />
//                   }
//                   text="Change Password"
//                   href="/settings/change-password"
//                   isActive={pathname === "/settings/change-password"}
//                 />
//               </li>
//               <li>
//                 <button
//                   onClick={handleOpen}
//                   className="flex items-center gap-2 text-left w-full cursor-pointer transition-colors mb-4 text-secondary hover:text-primary"
//                 >
//                   <Image
//                     src="/images/settings/Delete.svg"
//                     alt="Delete Account"
//                     width={24}
//                     height={24}
//                   />
//                   <span className="h5">Delete Account</span>
//                 </button>
//               </li>
//               <li>
//                 <button
//                   onClick={() => logout()}
//                   className="flex items-center gap-2 text-left w-full cursor-pointer transition-colors mb-4 text-secondary hover:text-primary"
//                 >
//                   <Image
//                     src="/images/settings/Logout.svg"
//                     alt="Logout"
//                     width={24}
//                     height={24}
//                   />
//                   <span className="h5">Logout</span>
//                 </button>
//               </li>
//             </ul>
//           </div>
//         )}
//         {/* <!-- Dropdown End --> */}
//       </ClickOutside>
//       <Modal
//         isOpen={isOpen}
//         onClose={handleClose}
//         // buttonContent="Delete"
//       >
//         <div className="text-center">
//           <Image
//             src="/images/Modal/delete.svg"
//             alt="Delete Account"
//             width={141}
//             height={141}
//             className="mx-auto mb-4"
//           />
//           <h4 className="h4 font-bold mb-2">Delete Account?</h4>
//           <p className="p3 text-secondary/50">
//             Are you sure you want to delete your account? All account details
//             will be deleted.
//           </p>
//         </div>
//         <div className="flex flex-row justify-center gap-3 mt-6">
//           <UserButton
//             variant="white"
//             onClick={handleClose}
//             className="mt-4 bg-[#F5F5F5] text-secondary/50 px-7 py-2 rounded-lg"
//           >
//             Cancel
//           </UserButton>
//           <UserButton
//             variant="danger"
//             onClick={handleDeleteAccount}
//             className="mt-4 text-white px-7 py-2 rounded-lg"
//           >
//             Delete
//           </UserButton>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default UserDropdown;
