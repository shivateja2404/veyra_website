
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
  id: number;
  name: string;
  username: string;
  avatar: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Aisha Patel",
    username: "@aishabeauty",
    avatar: "/user.png",
    quote: "Veyra has completely changed how I monetize my style content. I'm earning more than ever before!"
  },
  {
    id: 2,
    name: "Raj Mehta",
    username: "@rajstylist",
    avatar: "/user.png",
    quote: "I've tried many platforms, but Veyra's commission structure and ease of use are unmatched."
  },
  {
    id: 3,
    name: "Priya Singh",
    username: "@priyasstyle",
    avatar: "/user.png",
    quote: "My followers love how they can instantly shop my looks. It's a win-win for everyone!"
  },
  {
    id: 4,
    name: "Arjun Kapoor",
    username: "@arjuntrends",
    avatar: "/user.png",
    quote: "Since joining Veyra, I've been able to build a sustainable income stream from my fashion content."
  }
];

export const TestimonialSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  
   const nextSlide = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () =>
    setCurrent((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );

  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused) {
        nextSlide();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [paused]);

  return (
    <div
      className="relative w-full max-w-3xl mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="glass p-8 rounded-2xl"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
              <Image
                src={testimonials[current].avatar}
                alt={testimonials[current].name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-lg md:text-xl mb-6 italic">
              "{testimonials[current].quote}"
            </p>
            <div>
              <p className="font-semibold">{testimonials[current].name}</p>
              <p className="text-sm text-foreground/70">
                {testimonials[current].username}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrow buttons */}
{/* Arrow buttons */}
<button
  onClick={prevSlide}
  className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 
    p-2 rounded-full bg-white/70 hover:bg-white shadow-md transition"
  aria-label="Previous testimonial"
>
  <ChevronLeft className="w-5 h-5 text-foreground" />
</button>

<button
  onClick={nextSlide}
  className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 
    p-2 rounded-full bg-white/70 hover:bg-white shadow-md transition"
  aria-label="Next testimonial"
>
  <ChevronRight className="w-5 h-5 text-foreground" />
</button>

      {/* Dots navigation */}
      <div className="flex justify-center space-x-2 mt-6">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition-colors ${
              idx === current ? "bg-veyra-primary" : "bg-foreground/20"
            }`}
            aria-label={`Go to testimonial ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
