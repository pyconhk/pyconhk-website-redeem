declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Social Media Links
      NEXT_PUBLIC_TWITTER_URL: string;
      NEXT_PUBLIC_LINKEDIN_URL: string;
      NEXT_PUBLIC_YOUTUBE_URL: string;
      NEXT_PUBLIC_GITHUB_URL: string;
      NEXT_PUBLIC_FACEBOOK_URL: string;
      NEXT_PUBLIC_INSTAGRAM_URL: string;
      NEXT_PUBLIC_THREADS_URL: string;
      NEXT_PUBLIC_SITE_URL: string;
    }
  }
}

export {};
