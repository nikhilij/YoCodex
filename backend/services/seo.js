const { calculateReadingTime } = require("../utils/helpers");

// Generate meta description from content
exports.generateMetaDescription = (content, maxLength = 160) => {
   // Strip HTML tags and get plain text
   const plainText = content.replace(/<[^>]*>/g, "");

   if (plainText.length <= maxLength) {
      return plainText;
   }

   // Truncate at word boundary
   const truncated = plainText.substring(0, maxLength);
   const lastSpaceIndex = truncated.lastIndexOf(" ");

   return lastSpaceIndex > 0 ? truncated.substring(0, lastSpaceIndex) + "..." : truncated + "...";
};

// Generate Open Graph data
exports.generateOpenGraphData = (post) => {
   const baseUrl = process.env.FRONTEND_URL || "https://yocodex.com";

   return {
      title: post.title,
      description: this.generateMetaDescription(post.content),
      url: `${baseUrl}/posts/${post.slug}`,
      image: post.media.length > 0 ? post.media[0].url : `${baseUrl}/default-og-image.jpg`,
      type: "article",
      "article:author": post.author.username,
      "article:published_time": post.createdAt.toISOString(),
      "article:modified_time": post.updatedAt.toISOString(),
      "article:section": post.categories.length > 0 ? post.categories[0].name : "General",
      "article:tag": post.tags.map((tag) => tag.name).join(", "),
   };
};

// Generate JSON-LD structured data
exports.generateStructuredData = (post) => {
   const baseUrl = process.env.FRONTEND_URL || "https://yocodex.com";

   return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: this.generateMetaDescription(post.content),
      image: post.media.length > 0 ? post.media[0].url : `${baseUrl}/default-image.jpg`,
      author: {
         "@type": "Person",
         name: post.author.username,
         url: `${baseUrl}/users/${post.author.username}`,
      },
      publisher: {
         "@type": "Organization",
         name: "YoCodex",
         logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/logo.png`,
         },
      },
      datePublished: post.createdAt.toISOString(),
      dateModified: post.updatedAt.toISOString(),
      mainEntityOfPage: {
         "@type": "WebPage",
         "@id": `${baseUrl}/posts/${post.slug}`,
      },
      articleSection: post.categories.map((cat) => cat.name),
      keywords: post.tags.map((tag) => tag.name).join(", "),
      wordCount: post.content.split(/\s+/).length,
      timeRequired: `PT${calculateReadingTime(post.content)}M`,
   };
};

// Generate canonical URL
exports.generateCanonicalUrl = (path) => {
   const baseUrl = process.env.FRONTEND_URL || "https://yocodex.com";
   return `${baseUrl}${path}`;
};

// Generate sitemap data
exports.generateSitemapData = async () => {
   const Post = require("../models/Post");
   const User = require("../models/User");
   const Category = require("../models/Category");

   const baseUrl = process.env.FRONTEND_URL || "https://yocodex.com";
   const urls = [];

   // Add static pages
   urls.push({
      url: baseUrl,
      lastmod: new Date().toISOString(),
      priority: 1.0,
   });

   // Add published posts
   const posts = await Post.find({ status: "published" }).select("slug updatedAt").sort({ updatedAt: -1 });

   posts.forEach((post) => {
      urls.push({
         url: `${baseUrl}/posts/${post.slug}`,
         lastmod: post.updatedAt.toISOString(),
         priority: 0.8,
      });
   });

   // Add user profiles
   const users = await User.find({}).select("username updatedAt").limit(1000); // Limit to prevent too large sitemaps

   users.forEach((user) => {
      urls.push({
         url: `${baseUrl}/users/${user.username}`,
         lastmod: user.updatedAt?.toISOString() || new Date().toISOString(),
         priority: 0.6,
      });
   });

   // Add categories
   const categories = await Category.find({}).select("slug updatedAt");

   categories.forEach((category) => {
      urls.push({
         url: `${baseUrl}/categories/${category.slug}`,
         lastmod: category.updatedAt?.toISOString() || new Date().toISOString(),
         priority: 0.7,
      });
   });

   return urls;
};
