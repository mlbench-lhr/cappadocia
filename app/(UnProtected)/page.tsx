"use client";
import useTrackVisit from "@/hooks/useTrackVisit";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import Section1 from "./LandingPageSections/Section1";
import Section2 from "./LandingPageSections/Section2";
import Section3 from "./LandingPageSections/Section3";
import Section4 from "./LandingPageSections/Section4";

export default function app() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  useTrackVisit("app", null);
  async function getConnected(e: any) {
    e.preventDefault();
    try {
      setLoading(true);
      let response = await axios.post("/api/getConnected", {
        email: email,
      });

      if (response?.data?.message) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response?.data?.message || "Subscription Successful",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      setEmail("");
    } catch (error: any) {
      if (error?.response?.data?.message) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Failed to add blog",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="bg-[#FFF9F9] w-full h-fit pb-20">
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
    </div>
  );
}
