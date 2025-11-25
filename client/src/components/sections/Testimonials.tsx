import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ArrowLeft, ArrowRight, Play, Pause } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const testimonials = [
  {
    id: 1,
    name: "Unisoft Technologies",
    role: "Frontend Design Intern",
    content: "Himanshu demonstrated excellent frontend skills during his internship. He contributed significantly to our event management project with clean, responsive designs and modern UI/UX principles.",
    duration: "3 Months",
    projects: ["Event Management System", "Admin Dashboard"],
    rating: 5,
    image: "/api/placeholder/80/80"
  },
  {
    id: 2,
    name: "VR Data Solutions",
    role: "Full Stack Developer Intern",
    content: "A quick learner with strong problem-solving abilities. Himanshu has been instrumental in developing scalable web applications using React, Node.js, and MongoDB for our enterprise clients.",
    duration: "4 Months", 
    projects: ["Client Portal", "Data Visualization", "API Integration"],
    rating: 5,
    image: "/api/placeholder/80/80"
  },
  {
    id: 3,
    name: "GH Raisoni College",
    role: "B.Tech Computer Science",
    content: "Consistently demonstrates strong technical aptitude and project execution skills. His academic projects showcase practical application of modern web technologies and innovative problem-solving approaches.",
    duration: "2019-2023",
    projects: ["Final Year Project", "Academic Research"],
    rating: 5,
    image: "/api/placeholder/80/80"
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    timeoutRef.current = setTimeout(() => {
      nextTestimonial();
    }, 5000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, isAutoPlaying]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    })
  };
}