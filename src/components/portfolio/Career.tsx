"use client";

import { useState, useEffect } from "react";
import { getFirebaseApp } from "@/lib/firebase";
import { getFirestore, collection, getDocs, orderBy, query } from "firebase/firestore";

interface CareerItem {
  id: string;
  startDate: string;
  endDate: string | null;
  company: string;
  position: string;
  description: string;
  technologies: string[];
}

const Career = () => {
  const [careers, setCareers] = useState<CareerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const app = getFirebaseApp();
      const db = getFirestore(app);
      const careersRef = collection(db, "careers");
      const q = query(careersRef, orderBy("startDate", "desc"));
      const querySnapshot = await getDocs(q);

      const careersList: CareerItem[] = [];
      querySnapshot.forEach((doc) => {
        careersList.push({ id: doc.id, ...doc.data() } as CareerItem);
      });

      setCareers(careersList);
    } catch (error) {
      // エラーログを無効化
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  };

  if (loading) {
    return <div className="c-career c-career--loading">Loading...</div>;
  }

  return (
    <div className="c-career">
      <h2 className="c-career__title">経歴</h2>
      <div className="c-career__timeline">
        {careers.map((career) => (
          <div key={career.id} className="c-career__item">
            <div className="c-career__period">
              <span className="c-career__start">{formatDate(career.startDate)}</span>
              <span className="c-career__separator">〜</span>
              <span className="c-career__end">
                {career.endDate ? formatDate(career.endDate) : "現在"}
              </span>
            </div>
            <div className="c-career__content">
              <h3 className="c-career__company">{career.company}</h3>
              <p className="c-career__position">{career.position}</p>
              <p className="c-career__description">{career.description}</p>
              {career.technologies.length > 0 && (
                <div className="c-career__technologies">
                  {career.technologies.map((tech, index) => (
                    <span key={index} className="c-career__technology">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Career;
