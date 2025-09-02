import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Instagram, Linkedin, Twitter, Smartphone, ShoppingBag, DollarSign, Sparkles, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/Navbar';
/* import { HeroScene } from '@/components/HeroScene';
 */import { WaitlistForm } from '@/components/WaitlistForm';
import { EarningsChart } from '@/components/EarningsChart';
import { Counter } from '@/components/Counter';
import { TestimonialSlider } from '@/components/TestimonialSlider';
import { SEO } from '@/components/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { getUniqueGradient } from '@/components/ui/card';
import { Link } from 'react-router-dom';

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
        scale: 1.03,
        transition: { duration: 0.2 }
      }}
      className={`glass p-6 rounded-xl h-full bg-gradient-to-br ${gradientToUse} bg-opacity-20 hover:bg-opacity-30 border border-white/30 dark:border-white/10`}
    >
      <h3 className="text-xl font-semibold mb-3 text-white mix-blend-overlay dark:text-white/90">{title}</h3>
      <div className="text-white/90 dark:text-white/80">
        {children}
      </div>
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
      whileHover={{ 
        y: -8, 
        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
        transition: { duration: 0.2 }
      }}
      className={`rounded-xl p-6 md:p-7 bg-gradient-to-br ${gradientClass} shadow-lg backdrop-blur-sm`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center mb-4">
          <div className="mr-3 text-white bg-white/20 p-2 rounded-full">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-white/90">{description}</p>
      </div>
    </motion.div>
  );
};

const Index = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const openWaitlist = () => setIsWaitlistOpen(true);
  const closeWaitlist = () => setIsWaitlistOpen(false);

  // Predefined gradients for each section to ensure no duplicates
  const problemGradients = [
    "from-pink-500 to-rose-500",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500"
  ];

  const solutionGradients = [
    "from-purple-500 to-indigo-500",
    "from-amber-500 to-orange-500",
    "from-violet-500 to-purple-500",
    "from-red-500 to-orange-500"
  ];

  const earningsGradients = [
    "from-green-400 to-teal-500",
    "from-fuchsia-500 to-pink-500",
    "from-sky-400 to-blue-500",
    "from-yellow-400 to-amber-500"
  ];

  const brandsGradients = [
    "from-indigo-400 to-violet-500",
    "from-pink-400 to-red-500",
    "from-cyan-400 to-blue-500",
    "from-amber-400 to-yellow-500",
    "from-emerald-400 to-green-500"
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
    <>
      <SEO
        title="Veyra - Social Commerce Platform | Discover, Share & Shop Your Style"
        description="Join Veyra, the revolutionary social commerce platform where creators monetize their influence, users discover styles instantly, and brands connect authentically. Start your fashion journey today!"
        keywords="social commerce platform, fashion discovery app, creator monetization, style sharing, brand partnerships, fashion influencer tools, social shopping"
        structuredData={structuredData}
      />
      
      <Navbar onOpenWaitlist={openWaitlist} />
      <WaitlistForm isOpen={isWaitlistOpen} onClose={closeWaitlist} />
      
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen pt-24 pb-12 flex items-center">
{/*         <HeroScene />
 */}        <div className="container mx-auto px-4 z-10">
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Discover, Share and Shop Your Style Instantly.
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-foreground/80 text-balance">
              Where creators, users and brands meet — powered by content, commerce and community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                onClick={openWaitlist} 
                size="lg"
                className="bg-veyra-cta hover:bg-veyra-cta/90 text-white rounded-full px-8"
                aria-label="Join Veyra waitlist to get early access"
              >
                Join Waitlist
              </Button>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-8 left-0 right-0 flex justify-center"
            >
              <a href="#problem" className="animate-pulse-slow" aria-label="Scroll to problem section">
                <ArrowDown className="w-8 h-8" />
              </a>
            </motion.div>
          </motion.header>
        </div>
      </section>
      
      {/* Problem Section */}
      <section id="problem" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Fashion Discovery is Broken. We're Fixing It.</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <article>
                <FeatureCard title="For Users" gradientClass={problemGradients[0]}>
                  <p>Users can't easily shop styles they discover online</p>
                </FeatureCard>
              </article>
              <article>
                <FeatureCard title="For Creators" gradientClass={problemGradients[1]}>
                  <p>Creators struggle to monetize their influence</p>
                </FeatureCard>
              </article>
              <article>
                <FeatureCard title="For Brands" gradientClass={problemGradients[2]}>
                  <p>Brands overspend on ads without strong organic discovery</p>
                </FeatureCard>
              </article>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Solution Section */}
      <section id="solution" className="py-16 md:py-24 bg-veyra-primary/5 dark:bg-veyra-primary/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Seamless Discovery, Shopping and Earning — In One Place.</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <article>
                <FeatureCard title="Create" gradientClass={solutionGradients[0]}>
                  <p>Create digital wardrobes, post shoppable content</p>
                </FeatureCard>
              </article>
              <article>
                <FeatureCard title="Share" gradientClass={solutionGradients[1]}>
                  <p>Share content and earn commissions</p>
                </FeatureCard>
              </article>
              <article>
                <FeatureCard title="Sell" gradientClass={solutionGradients[2]}>
                  <p>Sell natively through creator feeds and brand listings</p>
                </FeatureCard>
              </article>
              <article>
                <FeatureCard title="Connect" gradientClass={solutionGradients[3]}>
                  <p>Share links on Instagram, WhatsApp, etc.</p>
                </FeatureCard>
              </article>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Gen Z Section */}
      <section id="gen-z" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Finally, a Social Media Platform Made for Gen Z</h2>
            <p className="text-xl mb-12 text-foreground/80">Not just another app — Veyra is built for how Gen Z discovers, shops and shares.</p>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <article>
                <GenZCard 
                  icon={<Smartphone size={24} />}
                  title="Fast Discovery"
                  description="Reels and posts made for instant inspo. Veyra feels as fast and intuitive as your feed — but built for shopping, not just scrolling."
                  sectionId="gen-z"
                />
              </article>
              <article>
                <GenZCard 
                  icon={<DollarSign size={24} />}
                  title="Real Influence, Real Income"
                  description="No brand collab? No problem. Earn directly from what you wear and share. Every creator — big or small — can be a seller."
                  sectionId="gen-z"
                />
              </article>
              <article>
                <GenZCard 
                  icon={<ShoppingBag size={24} />}
                  title="From Screenshot to Checkout"
                  description="No more 'where did you get that?' Tag items in your wardrobe, link them to your post, and let people shop in seconds."
                  sectionId="gen-z"
                />
              </article>
              <article>
                <GenZCard 
                  icon={<Sparkles size={24} />}
                  title="Express Yourself"
                  description="Style your vibe, your way. Create your own digital wardrobe, get outfit suggestions, and post without filters."
                  sectionId="gen-z"
                />
              </article>
              <article>
                <GenZCard 
                  icon={<Package size={24} />}
                  title="No More Cringe Posts"
                  description="We get it — your content deserves better than spammy captions and salesy posts. Veyra lets your style shine with clean, authentic storytelling that doesn't scream 'ad'."
                  sectionId="gen-z"
                />
              </article>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-veyra-primary/5 dark:bg-veyra-primary/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">How Veyra Works</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <article className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full card-gradient-a mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Create</h3>
                <p>Upload looks, build digital wardrobe</p>
              </article>
              <article className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full card-gradient-a mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Tag</h3>
                <p>Add product links from marketplace</p>
              </article>
              <article className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full card-gradient-a mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Shop & Share</h3>
                <p>Users shop instantly, creators earn</p>
              </article>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Earnings Section */}
      <section id="earnings" className="py-16 md:py-24 bg-veyra-primary/5 dark:bg-veyra-primary/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Turn Your Style Into Income</h2>
            <p className="text-center mb-12 text-lg">How creators can monetize their influence on Veyra</p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <article>
                <FeatureCard title="Tag products" gradientClass={earningsGradients[0]}>
                  <p>Tag products in your posts and earn commission when followers purchase</p>
                </FeatureCard>
              </article>
              <article>
                <FeatureCard title="Create a storefront" gradientClass={earningsGradients[1]}>
                  <p>Build your digital storefront and earn passively from your recommendations</p>
                </FeatureCard>
              </article>
              <article>
                <FeatureCard title="Share across platforms" gradientClass={earningsGradients[2]}>
                  <p>Share your Veyra links on Instagram, WhatsApp, and other platforms</p>
                </FeatureCard>
              </article>
              <article>
                <FeatureCard title="Brand collaborations" gradientClass={earningsGradients[3]}>
                  <p>Connect with brands for exclusive partnerships and sponsored content</p>
                </FeatureCard>
              </article>
            </div>
            
            <div className="glass rounded-xl p-6 md:p-8">
              <h3 className="text-2xl font-semibold mb-6 text-center">Estimated Monthly Earnings by Follower Count</h3>
              <EarningsChart />
              <p className="text-sm text-center mt-4 text-foreground/70">
                Actual results vary based on engagement and product category
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Impact Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0 }}
                className="text-center glass p-8 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 bg-opacity-20"
              >
                <Counter end={100} suffix="+" />
                <p className="mt-2">Brands onboarding</p>
              </motion.article>
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center glass p-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 bg-opacity-20"
              >
                <Counter end={500} suffix="+" />
                <p className="mt-2">Creators waitlisted</p>
              </motion.article>
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-center glass p-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 bg-opacity-20"
              >
                <Counter end={5000} suffix="+" />
                <p className="mt-2">Products available</p>
              </motion.article>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 bg-veyra-primary/5 dark:bg-veyra-primary/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12">What Creators Are Saying</h2>
            <TestimonialSlider />
          </motion.div>
        </div>
      </section>
      
      {/* For Brands Section */}
      <section id="brands" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">How Brands & Businesses Win With Veyra</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <article>
                <FeatureCard title="Trust-Based Discovery" gradientClass={brandsGradients[0]}>
                  <p>Leverage creator trust over traditional ads</p>
                </FeatureCard>
              </article>
              <article>
                <FeatureCard title="Lower Acquisition Costs" gradientClass={brandsGradients[1]}>
                  <p>Pay only when users shop your products</p>
                </FeatureCard>
              </article>
              <article>
                <FeatureCard title="Creator Collab at Scale" gradientClass={brandsGradients[2]}>
                  <p>Work with micro & nano creators efficiently</p>
                </FeatureCard>
              </article>
              <article>
                <FeatureCard title="Performance-Based Spend" gradientClass={brandsGradients[3]}>
                  <p>No upfront costs, pay for results</p>
                </FeatureCard>
              </article>
              <article>
                <FeatureCard title="Organic Virality" gradientClass={brandsGradients[4]}>
                  <p>Get discovered via shareable content</p>
                </FeatureCard>
              </article>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={openWaitlist} 
                size="lg"
                className="bg-veyra-cta hover:bg-veyra-cta/90 text-white rounded-full px-8"
                aria-label="Partner with Veyra for brand collaboration"
              >
                Partner With Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Hiring Section */}
      <section id="hiring" className="py-16 md:py-24 bg-veyra-primary/5 dark:bg-veyra-primary/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Journey – We're Hiring!</h2>
            <p className="text-lg mb-8">
              We're looking for passionate developers, designers, and marketers to shape the future of social commerce.
            </p>
            <Button
              onClick={() => window.open('https://forms.gle/neu9tbPGMTY9cRqx7', '_blank')}
              size="lg"
              className="bg-veyra-cta hover:bg-veyra-cta/90 text-white rounded-full px-8"
              aria-label="Apply for careers at Veyra"
            >
              Apply Now
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Footer Section */}
      <footer className="py-12 md:py-16 border-t border-foreground/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">Veyra</h3>
              <p className="text-foreground/70">
                The social commerce platform where creators, users, and brands meet.
              </p>
            </div>
            <nav>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-foreground/70 hover:text-foreground">Home</a></li>
                <li><a href="#problem" className="text-foreground/70 hover:text-foreground">Problem</a></li>
                <li><a href="#solution" className="text-foreground/70 hover:text-foreground">Solution</a></li>
                <li><a href="#how-it-works" className="text-foreground/70 hover:text-foreground">How It Works</a></li>
              </ul>
            </nav>
            <nav>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-foreground/70 hover:text-foreground">Waitlist</a></li>
                <li><a href="#hiring" className="text-foreground/70 hover:text-foreground">Careers</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-foreground">Contact Us</a></li>
              </ul>
            </nav>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/veyra__in/" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-foreground" aria-label="Follow Veyra on Instagram">
                  <Instagram />
                </a>
                <a href="https://www.linkedin.com/company/veyra-social-commerce-platform/" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-foreground" aria-label="Connect with Veyra on LinkedIn">
                  <Linkedin />
                </a>
                <a href="#" className="text-foreground/70 hover:text-foreground" aria-label="Follow Veyra on Twitter">
                  <Twitter />
                </a>
              </div>
            </div>
          </div>
          <Separator className="my-8 bg-foreground/10" />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-foreground/60">
              &copy; {new Date().getFullYear()} Veyra. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/terms" className="text-sm text-foreground/60 hover:text-foreground">Terms and Conditions</Link>
              <Link to="/privacy" className="text-sm text-foreground/60 hover:text-foreground">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Index;
