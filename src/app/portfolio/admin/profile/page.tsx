"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getFirebaseApp } from "@/lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import Link from "next/link";

interface ProfileData {
  name: string;
  nameEn: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  avatar: string;
}

const AdminProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    nameEn: "",
    title: "",
    bio: "",
    location: "",
    email: "",
    avatar: "",
  });
  const router = useRouter();

  useEffect(() => {
    const app = getFirebaseApp();
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchProfileData();
      } else {
        router.push("/portfolio/admin");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchProfileData = async () => {
    try {
      const app = getFirebaseApp();
      const db = getFirestore(app);
      const docRef = doc(db, "portfolio", "profile");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfileData(docSnap.data() as ProfileData);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const app = getFirebaseApp();
      const db = getFirestore(app);
      await setDoc(doc(db, "portfolio", "profile"), profileData);
      alert("プロフィールを更新しました");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <div className="c-admin-form c-admin-form--loading">Loading...</div>;
  }

  return (
    <div className="c-admin-form">
      <div className="c-admin-form__header">
        <h1 className="c-admin-form__title">プロフィール編集</h1>
        <Link href="/portfolio/admin/dashboard" className="c-admin-form__back">
          ← ダッシュボードに戻る
        </Link>
      </div>

      <form className="c-admin-form__form" onSubmit={handleSubmit}>
        <div className="c-admin-form__field">
          <label className="c-admin-form__label">名前（日本語）</label>
          <input
            type="text"
            className="c-admin-form__input"
            value={profileData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>

        <div className="c-admin-form__field">
          <label className="c-admin-form__label">名前（英語）</label>
          <input
            type="text"
            className="c-admin-form__input"
            value={profileData.nameEn}
            onChange={(e) => handleChange("nameEn", e.target.value)}
            required
          />
        </div>

        <div className="c-admin-form__field">
          <label className="c-admin-form__label">肩書き</label>
          <input
            type="text"
            className="c-admin-form__input"
            value={profileData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />
        </div>

        <div className="c-admin-form__field">
          <label className="c-admin-form__label">自己紹介</label>
          <textarea
            className="c-admin-form__textarea"
            value={profileData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            rows={5}
            required
          />
        </div>

        <div className="c-admin-form__field">
          <label className="c-admin-form__label">所在地</label>
          <input
            type="text"
            className="c-admin-form__input"
            value={profileData.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />
        </div>

        <div className="c-admin-form__field">
          <label className="c-admin-form__label">メールアドレス</label>
          <input
            type="email"
            className="c-admin-form__input"
            value={profileData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
        </div>

        <div className="c-admin-form__field">
          <label className="c-admin-form__label">アバター画像URL</label>
          <input
            type="url"
            className="c-admin-form__input"
            value={profileData.avatar}
            onChange={(e) => handleChange("avatar", e.target.value)}
          />
        </div>

        <div className="c-admin-form__actions">
          <button
            type="submit"
            className="c-admin-form__submit"
            disabled={saving}
          >
            {saving ? "保存中..." : "保存"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;
