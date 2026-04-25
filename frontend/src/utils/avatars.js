import g1 from '@/assets/image (1).png';
import g2 from '@/assets/image (2).png';
import g3 from '@/assets/image (3).png';
import g6 from '@/assets/image (6).png';
import img3 from '@/assets/image copy 2.png';
import ayeshaImg from '@/assets/ayesha_profile.png';
import img2 from '@/assets/image copy.png';

import b4 from '@/assets/image (4).png';
import b5 from '@/assets/image (5).png';
import b7 from '@/assets/image (7).png';
import b8 from '@/assets/image (8).png';
import b9 from '@/assets/image (9).png';
import b10 from '@/assets/image (10).png';

// Pool of UNIQUE icons
export const girlAvatars = [g1, g2, g3, ayeshaImg, g6, img3, img2];
export const boyAvatars = [b4, b5, b7, b8, b9, b10];

/**
 * Returns a deterministic avatar based on the user's name.
 * Using only the name as a seed to guarantee the EXACT SAME icon 
 * appears for a user across all pages (Home, Profile, Dashboard, etc.)
 */
export const getRandomAvatar = (name) => {
  if (!name) return girlAvatars[0];
  
  // Normalize name to ensure consistency
  const normalizedName = name.toLowerCase().trim();
  const firstName = normalizedName.split(' ')[0];

  // Gender detection heuristic
  const feminineEndings = ['a', 'i', 'y', 'e'];
  const commonGirlNames = [
    'chloe', 'zoey', 'emily', 'lily', 'sarah', 'ayesha', 'tanisha', 
    'priya', 'ananya', 'sneha', 'rhea', 'isha', 'sana', 'mehak', 
    'fatima', 'zoya', 'kiara', 'avani', 'divya', 'kavya', 'tanvi'
  ];
  
  const masculineEndings = ['n', 'm', 'j', 't', 'r', 'v', 'l', 's'];
  const commonBoyNames = [
    'arjun', 'ryan', 'john', 'alex', 'sam', 'kabir', 'rohan', 'ishaan', 
    'aarav', 'vihaan', 'advait', 'aryan', 'zayan', 'ayan', 'dev', 'veer'
  ];

  const isGirl = commonGirlNames.includes(firstName) || 
                 (feminineEndings.includes(firstName.slice(-1)) && !commonBoyNames.includes(firstName)) || 
                 firstName.endsWith('ee');
  
  // Simple but effective deterministic hash
  let hash = 0;
  for (let i = 0; i < normalizedName.length; i++) {
    hash = normalizedName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Combined seed for variety
  const finalSeed = Math.abs(hash + normalizedName.length + normalizedName.charCodeAt(0));
  
  if (normalizedName.includes('arjun')) return boyAvatars[boyAvatars.length - 1]; // Give Arjun the Senior Expert icon
  
  if (isGirl) {
    return girlAvatars[finalSeed % girlAvatars.length];
  } else {
    return boyAvatars[finalSeed % boyAvatars.length];
  }
};
