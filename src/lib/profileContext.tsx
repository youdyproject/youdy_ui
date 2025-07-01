"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import api from "@/utils/api";
import { tokenManager } from "@/lib/tokenManager";

interface ProfileContextType {
  profileImage: string | null;
  setProfileImage: (url: string | null) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined
);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const token = tokenManager.getToken();
      if (!token) {
        console.warn("✅ [ProfileContext] No token → Skip profile API call");
        return;
      }

      try {
        const res = await api.get("/api/member/dtl", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const imageUrl = res.data?.data?.profileImageUrl || null;
        console.log("✅ [ProfileContext] Loaded profile image:", imageUrl);
        setProfileImage(imageUrl);
      } catch (err) {
        console.error("[ProfileContext] Failed to load profile:", err);
      }
    };

    loadProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};