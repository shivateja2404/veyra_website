'use client'
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Instagram, Linkedin, Twitter, Smartphone, ShoppingBag, DollarSign, Sparkles, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/Navbar';
  import { WaitlistForm } from '@/components/WaitlistForm';
import { EarningsChart } from '@/components/EarningsChart';
import { Counter } from '@/components/Counter';
import { TestimonialSlider } from '@/components/TestimonialSlider';
import { SEO } from '@/components/SEO';
import { Card, CardContent} from '@/components/ui/card';
import { getUniqueGradient } from '@/components/ui/ui/card';
import Link from "next/link";


 const FloatingOrbs = () => {
  const [orbs, setOrbs] = useState<{top: string; left: string; width: number; height: number;}[]>([]);

  useEffect(() => {
    setOrbs(
      Array.from({ length: 8 }, () => ({
        width: Math.random() * 400,
        height: Math.random() * 400,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }))
    );
  }, []);

  return (
    <>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-purple-400/10 to-pink-400/10 blur-xl"
          style={{ width: orb.width, height: orb.height, top: orb.top, left: orb.left }}
        />
      ))}
    </>
  );
};
const FeatureCard = ({ 
  title, 
  children, 
  gradientClass 
}: { 
  title: string, 
  children: React.ReactNode,
  gradientClass?: string 
}) => {
  // Create an array of vibrant gradient color pairs for the different cards
  const gradients = [
    "from-purple-500 to-indigo-500",
    "from-pink-500 to-rose-500",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-amber-500 to-orange-500",
    "from-violet-500 to-purple-500",
    "from-red-500 to-orange-500",
    "from-green-400 to-teal-500",
    "from-fuchsia-500 to-pink-500",
    "from-sky-400 to-blue-500",
    "from-yellow-400 to-amber-500",
    "from-indigo-400 to-violet-500"
  ];
  
  // Use the provided gradient class or select a random one
  const gradientToUse = gradientClass || gradients[Math.floor(Math.random() * gradients.length)];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -10, 
        scale: 1.05,
        rotate: 1,
        transition: { duration: 0.3, type: "spring", stiffness: 300 }
      }}
      className={`group relative overflow-hidden p-6 sm:p-8 rounded-2xl h-full bg-gradient-to-br ${gradientToUse} 
        border border-white/20 dark:border-white/10 backdrop-blur-sm shadow-2xl
        before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/20 before:to-transparent before:opacity-0 
        hover:before:opacity-100 before:transition-opacity before:duration-300`}
    >
      {/* Floating particles effect */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-white/60 rounded-full animate-pulse" />
      <div className="absolute bottom-6 left-6 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-300" />
      
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
      
      <div className="relative z-10">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white drop-shadow-lg">
          {title}
        </h3>
        <div className="text-white/95 dark:text-white/90 text-sm sm:text-base leading-relaxed">
          {children}
        </div>
      </div>
      
      {/* Corner accent */}
      <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
    </motion.div>
  );
};


const GenZCard = ({
  icon,
  title,
  description,
  sectionId
}: {
  icon: React.ReactNode,
  title: string,
  description: string,
  sectionId: string
}) => {
  // Get a unique gradient for this card in this section
  const gradientClass = getUniqueGradient(sectionId);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6, 
        type: "spring", 
        stiffness: 100,
        staggerChildren: 0.1 
      }}
      whileHover={{ 
        y: -12, 
        scale: 1.02,
        rotateY: 5,
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
        transition: { duration: 0.3, type: "spring", stiffness: 300 }
      }}
      className={`group relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-br ${gradientClass} 
        shadow-2xl backdrop-blur-sm border border-white/20 dark:border-white/10
        before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/10 before:to-transparent
        hover:before:from-black/5`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12" />
      </div>
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex flex-col h-full relative z-10">
        <div className="flex items-center mb-6">
          <motion.div 
            className="mr-4 text-white bg-white/20 p-3 sm:p-4 rounded-2xl backdrop-blur-sm border border-white/30"
            whileHover={{ 
              scale: 1.1, 
              rotate: 360,
              transition: { duration: 0.5 }
            }}
          >
            {icon}
          </motion.div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
            {title}
          </h3>
        </div>
        <motion.p 
          className="text-white/95 text-sm sm:text-base md:text-lg leading-relaxed flex-1"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
        >
          {description}
        </motion.p>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-white/60 rounded-full animate-ping" />
      <div className="absolute bottom-6 left-4 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse delay-1000" />
    </motion.div>
  );
};

const Index = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const openWaitlist = () => setIsWaitlistOpen(true);
  const closeWaitlist = () => setIsWaitlistOpen(false);

  // Predefined gradients for each section to ensure no duplicates
  const problemGradients = [
    "from-red-500 via-pink-500 to-rose-500",
    "from-blue-500 via-indigo-500 to-cyan-500",
    "from-emerald-500 via-green-500 to-teal-500"
  ];

  const solutionGradients = [
    "from-purple-500 via-violet-500 to-indigo-500",
    "from-amber-500 via-yellow-500 to-orange-500",
    "from-violet-500 via-purple-500 to-fuchsia-500",
    "from-red-500 via-pink-500 to-orange-500"
  ];

  const earningsGradients = [
    "from-green-400 via-emerald-400 to-teal-500",
    "from-fuchsia-500 via-pink-500 to-rose-500",
    "from-sky-400 via-blue-400 to-cyan-500",
    "from-yellow-400 via-amber-400 to-orange-500"
  ];

  const brandsGradients = [
    "from-indigo-400 via-blue-400 to-violet-500",
    "from-pink-400 via-rose-400 to-red-500",
    "from-cyan-400 via-teal-400 to-blue-500",
    "from-amber-400 via-orange-400 to-yellow-500",
    "from-emerald-400 via-green-400 to-teal-500"
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Veyra",
    "description": "Social commerce platform where creators, users, and brands meet — powered by content, commerce, and community.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "500"
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <SEO
        title="Veyra - Social Commerce Platform | Discover, Share & Shop Your Style"
        description="Join Veyra, the revolutionary social commerce platform where creators monetize their influence, users discover styles instantly, and brands connect authentically. Start your fashion journey today!"
        keywords="social commerce platform, fashion discovery app, creator monetization, style sharing, brand partnerships, fashion influencer tools, social shopping"
        structuredData={structuredData}
      />
      
      <Navbar onOpenWaitlist={openWaitlist} />
      <WaitlistForm isOpen={isWaitlistOpen} onClose={closeWaitlist} />
      
      {/* Hero section */}
      <section id="hero" className="relative min-h-screen pt-20 pb-12 flex items-center overflow-hidden">
         
        {/* Additional background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
        <div className="absolute inset-0">
          {/* Floating orbs */}
           <FloatingOrbs />

        </div>

        <div className="container mx-auto px-4 z-10 relative">
          <motion.header
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: "spring", stiffness: 100 }}
            className="max-w-6xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block mb-8"
            >
              <span className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 
                rounded-full border border-white/20 text-sm sm:text-base font-medium backdrop-blur-sm
                shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                ✨ The Future of Social Commerce is Here
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight">
              <motion.span 
                className="block bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Discover, Share and
              </motion.span>
              <motion.span 
                className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Shop Your Style
              </motion.span>
              <motion.span 
                className="block text-white drop-shadow-2xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                Instantly.
              </motion.span>
            </h1>
            
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              Where creators, users and brands meet — powered by{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">
                content, commerce and community
              </span>
              .
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
<Button
  onClick={openWaitlist}
  size="lg"
  className="bg-gradient-to-r from-purple-500 to-indigo-500 
    hover:from-purple-600 hover:to-indigo-600
    text-white font-medium rounded-full 
    px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg
    shadow-md hover:shadow-lg 
    transition-all duration-200"
  aria-label="Join Veyra waitlist to get early access"
>
  Join Waitlist
</Button>


         
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="flex justify-center"
            >
              <motion.a 
                href="#problem" 
                className="inline-block p-4 rounded-full bg-white/5 border border-white/20 
                  backdrop-blur-sm hover:bg-white/10 transition-all duration-300
                  hover:scale-110 group"
                aria-label="Scroll to problem section"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowDown className="w-6 h-6 sm:w-8 sm:h-8 group-hover:text-purple-400 transition-colors duration-300" />
              </motion.a>
            </motion.div>
          </motion.header>
        </div>
        
        {/* Scroll progress indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block">
          <div className="w-1 h-24 bg-gradient-to-b from-transparent via-white/30 to-transparent rounded-full" />
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-16 sm:py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-12">
              <span className="bg-gradient-to-r from-red-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                Fashion Discovery
              </span>
              <br />
              <span className="text-white">is Broken.</span>
              <br />
              <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                We're Fixing It.
              </span>
            </h2>
            
            <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
              <article>
                <FeatureCard title="For Users 😩" gradientClass={problemGradients[0]}>
                  <p className="text-base sm:text-lg">
                    Users can't easily shop styles they discover online. 
                    It's all screenshots and endless "where did you get that?" comments.
                  </p>
                </FeatureCard>
              </article>
              <article>
                <FeatureCard title="For Creators 💸" gradientClass={problemGradients[1]}>
                  <p className="text-base sm:text-lg">
                    Creators struggle to monetize their influence without brand deals. 
                    Your style deserves to pay the bills!
                  </p>
                </FeatureCard>
              </article>
              <article>
                <FeatureCard title="For Brands 📈" gradientClass={problemGradients[2]}>
                  <p className="text-base sm:text-lg">
                    Brands overspend on ads without strong organic discovery. 
                    Trust beats ads every single time.
                  </p>
                </FeatureCard>
              </article>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Solution Section */}
      <section id="solution" className="py-16 sm:py-20 md:py-32 bg-gradient-to-br from-gray-900/30 via-purple-900/10 to-pink-900/20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-12">
              <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Seamless Discovery,
              </span>
              <br />
              <span className="text-white">Shopping and Earning</span>
              <br />
              <span className="bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                In One Place.
              </span>
            </h2>
            
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
              <article>
                <FeatureCard title="Create ✨" gradientClass={solutionGradients[0]}>
                  <p className="text-sm sm:text-base">Create digital wardrobes, post shoppable content that actually converts</p>
                </FeatureCard>
              </article>
              <article>
                <FeatureCard title="Share 🚀" gradientClass={solutionGradients[1]}>
                  <p className="text-sm sm:text-base">Share content and earn commissions without the cringe captions</p>
                </FeatureCard>
              </article>
              <article>
                <FeatureCard title="Sell 💳" gradientClass={solutionGradients[2]}>
                  <p className="text-sm sm:text-base">Sell natively through creator feeds and brand listings</p>
                </FeatureCard>
              </article>
              <article>
                <FeatureCard title="Connect 🌍" gradientClass={solutionGradients[3]}>
                  <p className="text-sm sm:text-base">Share links on Instagram, WhatsApp, etc.</p>
                </FeatureCard>
              </article>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Gen Z Section */}
      <section id="gen-z" className="py-16 sm:py-20 md:py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Finally, a </span>
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Social Media Platform
              </span>
              <br />
              <span className="text-white">Made for </span>
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Gen Z
              </span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl mb-16 text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Not just another app — Veyra is built for how Gen Z discovers, shops and shares. 
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold"> No cap! 🧢</span>
            </p>
            
            <div className="grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-3">
              <article>
                <GenZCard 
                  icon={<Smartphone className="w-6 h-6 sm:w-7 sm:h-7 text-white" />}
                  title="Fast Discovery"
                  description="Reels and posts made for instant inspo. Veyra feels as fast and intuitive as your feed — but built for shopping, not just scrolling. It's giving main character energy! ⚡"
                  sectionId="gen-z"
                />
              </article>
              <article>
                <GenZCard 
                  icon={<DollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-white" />}
                  title="Real Influence, Real Income"
                  description="No brand collab? No problem. Earn directly from what you wear and share. Every creator — big or small — can be a seller. Your fit, your coins! 💰"
                  sectionId="gen-z"
                />
              </article>
              <article>
                <GenZCard 
                  icon={<ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-white" />}
                  title="From Screenshot to Checkout"
                  description="No more 'where did you get that?' Tag items in your wardrobe, link them to your post, and let people shop in seconds. Screenshots are so yesterday! 📸➡️🛒"
                  sectionId="gen-z"
                />
              </article>
              <article>
                <GenZCard 
                  icon={<Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />}
                  title="Express Yourself"
                  description="Style your vibe, your way. Create your own digital wardrobe, get outfit suggestions, and post without filters. Authenticity hits different! ✨"
                  sectionId="gen-z"
                />
              </article>
              <article>
                <GenZCard 
                  icon={<Package className="w-6 h-6 sm:w-7 sm:h-7 text-white" />}
                  title="No More Cringe Posts"
                  description="We get it — your content deserves better than spammy captions and salesy posts. Veyra lets your style shine with clean, authentic storytelling. It's giving tasteful influencer! 🎨"
                  sectionId="gen-z"
                />
              </article>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 md:py-32 bg-gradient-to-br from-purple-900/20 via-pink-900/10 to-blue-900/20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-16 text-center">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                How Veyra Works
              </span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
              {[
                { 
                  step: "1", 
                  title: "Create", 
                  desc: "Upload looks, build digital wardrobe",
                  gradient: "from-purple-500 via-pink-500 to-violet-500"
                },
                { 
                  step: "2", 
                  title: "Tag", 
                  desc: "Add product links from marketplace",
                  gradient: "from-pink-500 via-rose-500 to-orange-500"
                },
                { 
                  step: "3", 
                  title: "Shop & Share", 
                  desc: "Users shop instantly, creators earn",
                  gradient: "from-orange-500 via-amber-500 to-yellow-500"
                }
              ].map((item, index) => (
                <motion.article 
                  key={index} 
                  className="flex flex-col items-center text-center group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                >
                  <motion.div 
                    className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br ${item.gradient} 
                      mb-6 flex items-center justify-center shadow-2xl border border-white/20
                      group-hover:scale-110 transition-all duration-500 relative overflow-hidden`}
                    whileHover={{ 
                      rotate: 360,
                      transition: { duration: 0.8 }
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white relative z-10 drop-shadow-lg">
                      {item.step}
                    </span>
                    <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-transparent rounded-full 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-base sm:text-lg max-w-xs leading-relaxed">
                    {item.desc}
                  </p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Earnings Section */}
      <section id="earnings" className="py-16 sm:py-20 md:py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-center">
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Turn Your Style
              </span>
              <br />
              <span className="text-white">Into Income</span>
            </h2>
            <p className="text-center mb-16 text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              How creators can monetize their influence on Veyra — no followers required! 💪
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-16">
              <article>
                <FeatureCard title="Tag products 🏷️" gradientClass={earningsGradients[0]}>
                  <p className="text-sm sm:text-base">Tag products in your posts and earn commission when followers purchase</p>
                </FeatureCard>
              </article>
              <article>
                <FeatureCard title="Create a storefront 🏪" gradientClass={earningsGradients[1]}>
                  <p className="text-sm sm:text-base">Build your digital storefront and earn passively from your recommendations</p>
                </FeatureCard>
              </article>
              <article>
                <FeatureCard title="Share across platforms 📱" gradientClass={earningsGradients[2]}>
                  <p className="text-sm sm:text-base">Share your Veyra links on Instagram, WhatsApp, and other platforms</p>
                </FeatureCard>
              </article>
              <article>
                <FeatureCard title="Brand collaborations 🤝" gradientClass={earningsGradients[3]}>
                  <p className="text-sm sm:text-base">Connect with brands for exclusive partnerships and sponsored content</p>
                </FeatureCard>
              </article>
            </div>
            
            <motion.div 
              className="bg-gradient-to-br from-gray-900/80 via-purple-900/20 to-pink-900/20 rounded-3xl p-6 sm:p-8 md:p-12 
                border border-white/20 backdrop-blur-sm shadow-2xl relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5" />
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-white">
                  Estimated Monthly Earnings by Follower Count
                </h3>
                <EarningsChart />
                <p className="text-sm sm:text-base text-center mt-6 text-gray-400">
                  Actual results vary based on engagement and product category. 
                  <span className="text-purple-400 font-medium"> But the potential is real! 🚀</span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Impact Section */}
      <section className="py-16 sm:py-20 md:py-32 bg-gradient-to-br from-purple-900/10 via-pink-900/5 to-blue-900/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                The Numbers Don't Lie
              </span>
            </motion.h2>
            
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              {[
                { 
                  number: 100, 
                  suffix: "+", 
                  label: "Brands onboarding", 
                  gradient: "from-purple-500 via-pink-500 to-violet-500",
                  icon: "🏢"
                },
                { 
                  number: 500, 
                  suffix: "+", 
                  label: "Creators waitlisted", 
                  gradient: "from-blue-500 via-cyan-500 to-teal-500",
                  icon: "👥"
                },
                { 
                  number: 5000, 
                  suffix: "+", 
                  label: "Products available", 
                  gradient: "from-emerald-500 via-green-500 to-lime-500",
                  icon: "📦"
                }
              ].map((stat, index) => (
                <motion.article
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotate: 1,
                    transition: { duration: 0.3 }
                  }}
                  className={`text-center p-6 sm:p-8 md:p-10 rounded-3xl bg-gradient-to-br ${stat.gradient} 
                    bg-opacity-20 border border-white/20 backdrop-blur-sm shadow-2xl
                    hover:shadow-purple-500/25 transition-all duration-300 relative overflow-hidden group`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-white/10 to-transparent rounded-3xl 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className="text-4xl sm:text-5xl mb-4">{stat.icon}</div>
                    <Counter end={stat.number} suffix={stat.suffix} />
                    <p className="mt-4 text-base sm:text-lg text-gray-300 font-medium">
                      {stat.label}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 sm:py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-purple-900/10 to-pink-900/20" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-16">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                What Creators Are Saying
              </span>
            </h2>
            <div className="relative">
              <TestimonialSlider />
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* For Brands Section */}
      <section id="brands" className="py-16 sm:py-20 md:py-32 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 text-center">
              <span className="text-white">How </span>
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Brands & Businesses
              </span>
              <br />
              <span className="text-white">Win With Veyra</span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
              <article>
                <FeatureCard title="Trust-Based Discovery 🤝" gradientClass={brandsGradients[0]}>
                  <p className="text-sm sm:text-base">Leverage creator trust over traditional ads</p>
                </FeatureCard>
              </article>
              <article>
                <FeatureCard title="Lower Acquisition Costs 💰" gradientClass={brandsGradients[1]}>
                  <p className="text-sm sm:text-base">Pay only when users shop your products</p>
                </FeatureCard>
              </article>
              <article>
                <FeatureCard title="Creator Collab at Scale 📈" gradientClass={brandsGradients[2]}>
                  <p className="text-sm sm:text-base">Work with micro & nano creators efficiently</p>
                </FeatureCard>
              </article>
              <article>
                <FeatureCard title="Performance-Based Spend 🎯" gradientClass={brandsGradients[3]}>
                  <p className="text-sm sm:text-base">No upfront costs, pay for results</p>
                </FeatureCard>
              </article>
              <article>
                <FeatureCard title="Organic Virality 🚀" gradientClass={brandsGradients[4]}>
                  <p className="text-sm sm:text-base">Get discovered via shareable content</p>
                </FeatureCard>
              </article>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={openWaitlist} 
                size="lg"
                className="group bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                  hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 
                  text-white rounded-full px-8 sm:px-10 py-3 sm:py-4
                  shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50
                  transform hover:scale-105 transition-all duration-300
                  border border-white/20"
                aria-label="Partner with Veyra for brand collaboration"
              >
                <span className="relative z-10">Partner With Us</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Hiring Section */}
      <section id="hiring" className="py-16 sm:py-20 md:py-32 bg-gradient-to-br from-purple-900/20 via-pink-900/10 to-orange-900/10 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
                Join Our Journey
              </span>
              <br />
              <span className="text-white">— We're Hiring! 🚀</span>
            </h2>
            <p className="text-lg sm:text-xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We're looking for passionate developers, designers, and marketers to shape the future of social commerce.
              <span className="text-purple-400 font-semibold"> Ready to build the next big thing? </span>
            </p>
            <Button
              onClick={() => window.open('https://forms.gle/neu9tbPGMTY9cRqx7', '_blank')}
              size="lg"
              className="group bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 
                hover:from-orange-600 hover:via-red-600 hover:to-pink-600 
                text-white rounded-full px-8 sm:px-10 py-3 sm:py-4
                shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50
                transform hover:scale-105 transition-all duration-300
                border border-white/20"
              aria-label="Apply for careers at Veyra"
            >
              <span className="relative z-10">Apply Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Footer Section */}
      <footer className="py-12 sm:py-16 md:py-20 border-t border-white/10 bg-gradient-to-br from-gray-900/50 to-black">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 sm:gap-12 mb-12">
            <div className="md:col-span-1">
              <h3 className="font-bold text-2xl sm:text-3xl mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Veyra
              </h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                The social commerce platform where creators, users, and brands meet.
                <span className="text-purple-400 font-medium"> Building the future of fashion discovery! ✨</span>
              </p>
            </div>
            <nav className="md:col-span-1">
              <h4 className="font-semibold text-lg mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">
                {['Home', 'Problem', 'Solution', 'How It Works'].map((item, index) => (
                  <li key={index}>
                    <a 
                      href={index === 0 ? '#' : `#${item.toLowerCase().replace(' ', '-')}`} 
                      className="text-gray-400 hover:text-purple-400 transition-colors duration-300 text-sm sm:text-base
                        hover:underline decoration-purple-400 underline-offset-4"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <nav className="md:col-span-1">
              <h4 className="font-semibold text-lg mb-6 text-white">Resources</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Waitlist', href: '#' },
                  { name: 'Careers', href: '#hiring' },
                  { name: 'Contact Us', href: '#' }
                ].map((item, index) => (
                  <li key={index}>
                    <a 
                      href={item.href} 
                      className="text-gray-400 hover:text-purple-400 transition-colors duration-300 text-sm sm:text-base
                        hover:underline decoration-purple-400 underline-offset-4"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="md:col-span-1">
              <h4 className="font-semibold text-lg mb-6 text-white">Connect</h4>
              <div className="flex space-x-4">
                {[
                  { 
                    icon: Instagram, 
                    href: "https://www.instagram.com/veyra__in/", 
                    label: "Follow Veyra on Instagram",
                    color: "hover:text-pink-400"
                  },
                  { 
                    icon: Linkedin, 
                    href: "https://www.linkedin.com/company/veyra-social-commerce-platform/", 
                    label: "Connect with Veyra on LinkedIn",
                    color: "hover:text-blue-400"
                  },
                  { 
                    icon: Twitter, 
                    href: "https://x.com/veyrasocial?s=21&t=A3U9qPQU4uZO41GPHb6_Lw", 
                    label: "Follow Veyra on Twitter",
                    color: "hover:text-cyan-400"
                  }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-full bg-white/5 border border-white/10 text-gray-400 
                      ${social.color} transition-all duration-300 hover:scale-110 hover:bg-white/10`}
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
          
          <Separator className="my-8 bg-white/10" />
          
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm sm:text-base text-gray-500 text-center md:text-left">
              &copy; {new Date().getFullYear()} Veyra. All rights reserved. 
              <span className="text-purple-400 font-medium"> Made with 💜 for Gen Z</span>
            </p>
            <div className="flex space-x-6">
              <Link 
                href="/terms-and-conditions" 
                className="text-sm sm:text-base text-gray-500 hover:text-purple-400 transition-colors duration-300
                  hover:underline decoration-purple-400 underline-offset-4"
              >
                Terms and Conditions
              </Link>
              <Link 
                href="/privacypolicy" 
                className="text-sm sm:text-base text-gray-500 hover:text-purple-400 transition-colors duration-300
                  hover:underline decoration-purple-400 underline-offset-4"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div> ) ;}

    export default  Index ;