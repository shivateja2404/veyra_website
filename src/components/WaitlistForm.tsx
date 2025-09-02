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
        const { count, error } = await supabase
          .from('waitlist')
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        
        // Set count to at least 1000 or actual count + 1000 if higher
        setWaitlistCount(Math.max(1000, (count || 0) + 1000));
      } catch (error) {
        console.error('Error fetching waitlist count:', error);
        // Default to 1000 if there's an error
        setWaitlistCount(1000);
      }
    };
    
    if (isOpen) {
      fetchWaitlistCount();
    }
  }, [isOpen]);

  // Set up real-time subscription to waitlist changes
  useEffect(() => {
    if (!isOpen) return;

    const channel = supabase
      .channel('waitlist-changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'waitlist' 
      }, (payload) => {
        // Increment the waitlist count when someone new joins
        setWaitlistCount(prevCount => prevCount + 1);
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email.",
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
      // Check if email already exists in waitlist
      const { data: existingUser, error: checkError } = await supabase
        .from('waitlist')
        .select('email')
        .eq('email', email)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingUser) {
        // Email already exists in waitlist
        toast({
          title: "You're already on the waitlist!",
          description: "We'll notify you when we launch. Thank you for your interest!",
        });
        setLoading(false);
        setEmail('');
        setName('');
        setBrandName('');
        setIsBrand(false);
        onClose();
        return;
      }

      // Get IP address for analytics purposes
      let ip_address = null;
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ip_address = data.ip;
      } catch (error) {
        console.error('Could not get IP address:', error);
      }
      
      // Insert data into Supabase waitlist table
      const { error } = await supabase
        .from('waitlist')
        .insert([
          {
            email,
            full_name: name,
            brand_name: isBrand ? brandName.trim() : null,
            is_brand: isBrand,
            ip_address,
            source: window.location.href
          }
        ]);
      
      if (error) throw error;
      
      // Increment waitlist count locally (real-time subscription will handle other users)
      setWaitlistCount(prevCount => prevCount + 1);
      
      toast({
        title: "Success!",
        description: "You're officially on the waitlist!",
      });
      
      setEmail('');
      setName('');
      setBrandName('');
      setIsBrand(false);
      onClose();
    } catch (error) {
      console.error('Waitlist submission error:', error);
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
        <Image
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
