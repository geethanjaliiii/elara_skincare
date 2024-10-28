import React from 'react'
import { Star, Heart, Minus, Plus, Facebook, Twitter, Instagram } from 'lucide-react';

const SocialShare = () => (
    <div className="flex space-x-4 mb-6">
      <Facebook className="w-6 h-6 text-blue-600 cursor-pointer" />
      <Twitter className="w-6 h-6 text-blue-400 cursor-pointer" />
      <Instagram className="w-6 h-6 text-pink-600 cursor-pointer" />
    </div>
  );

export default SocialShare
