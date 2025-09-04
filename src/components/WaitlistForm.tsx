import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Image from 'next/image';

interface WaitlistFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaitlistForm: React.FC<WaitlistFormProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [isBrand, setIsBrand] = useState(false);
  const [loading, setLoading] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(1000);
  const { toast } = useToast();

  // Fetch initial waitlist count
useEffect(() => {
  const fetchWaitlistCount = async () => {
    try {
      const res = await fetch("/api/waitlist-count");
      const data = await res.json();

      if (data.success) {
        setWaitlistCount(data.waitlistCount);
      } else {
        setWaitlistCount(1000);
      }
    } catch (error) {
      console.error("Error fetching waitlist count:", error);
      setWaitlistCount(1000);
    }
  };

  if (isOpen) {
    fetchWaitlistCount();
  }
}, [isOpen]);


 

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ✅ Validation
  if (!email) {
    toast({
      title: "Error",
      description: "Please enter your email.",
      variant: "destructive",
    });
    return;
  }

  if (!emailRegex.test(email)) {
    toast({
      title: "Error",
      description: "Please enter a valid email address.",
      variant: "destructive",
    });
    return;
  }

  if (!name) {
    toast({
      title: "Error",
      description: "Please enter your full name.",
      variant: "destructive",
    });
    return;
  }

  if (isBrand && !brandName.trim()) {
    toast({
      title: "Error",
      description: "Please enter your brand name.",
      variant: "destructive",
    });
    return;
  }

  setLoading(true);

  try {
    // ✅ Get IP address (optional analytics)
    let ip_address = null;
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      ip_address = data.ip;
    } catch (err) {
      console.error("Could not get IP address:", err);
    }

    // ✅ Send to API route (instead of Supabase client)
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        brandName,
        isBrand,
        ip_address,
        source: window.location.href,
      }),
    });

    const result = await res.json();

    if (!result.success) {
      // Already on waitlist or some handled case
      toast({
        title: "Notice",
        description: result.message,
      });
    } else {
      // Successfully joined
      toast({
        title: "Success!",
        description: "You're officially on the waitlist!",
      });
      setWaitlistCount((prev) => prev + 1);
    }

    // ✅ Reset form fields
    setEmail("");
    setName("");
    setBrandName("");
    setIsBrand(false);
    onClose();
  } catch (error) {
    console.error("Waitlist submission error:", error);
    toast({
      title: "Error",
      description: "Failed to join waitlist. Please try again.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};



 return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md p-8 rounded-2xl mx-auto 
        bg-black/40 backdrop-blur-xl 
        border border-white/20 shadow-2xl flex flex-col items-center text-center"
      >
        {/* Logo */}
        <img
          src="/logo.svg.png"
          alt="Veyra Logo"
          className="w-14 h-14 mb-4"
        />
<DialogHeader className="space-y-2 text-center">
  <DialogTitle className="text-2xl font-semibold text-center text-white">
    Join the Waitlist
  </DialogTitle>
  <DialogDescription className="text-sm text-gray-400">
    Be among the first to experience{" "}
    <span className="font-medium text-white">Veyra</span>.  
    <span className="block mt-1 text-gray-300">
      {waitlistCount.toLocaleString()}+ already joined
    </span>
  </DialogDescription>
</DialogHeader>


        <form onSubmit={handleSubmit} className="space-y-5 mt-6 w-full">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-300"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="bg-white/5 border border-white/10 
              text-white placeholder:text-gray-500 
              focus:border-purple-400 focus:ring-2 focus:ring-purple-500 
              rounded-xl transition"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-gray-300"
            >
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              required
              className="bg-white/5 border border-white/10 
              text-white placeholder:text-gray-500 
              focus:border-purple-400 focus:ring-2 focus:ring-purple-500 
              rounded-xl transition"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isBrand"
              checked={isBrand}
              onCheckedChange={(checked) => setIsBrand(checked as boolean)}
            />
            <Label
              htmlFor="isBrand"
              className="text-sm cursor-pointer text-gray-300"
            >
              I’m a brand or business
            </Label>
          </div>

          {isBrand && (
            <div className="space-y-2">
              <Label
                htmlFor="brandName"
                className="text-sm font-medium text-gray-300"
              >
                Brand Name
              </Label>
              <Input
                id="brandName"
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Your Brand Name"
                required={isBrand}
                className="bg-white/5 border border-white/10 
                text-white placeholder:text-gray-500 
                focus:border-purple-400 focus:ring-2 focus:ring-purple-500 
                rounded-xl transition"
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3 text-base font-semibold 
            bg-gradient-to-r from-purple-500 to-indigo-600 
            hover:opacity-90 transition-all shadow-lg hover:shadow-xl 
            text-white"
          >
            {loading ? "Processing..." : "Join Waitlist"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
