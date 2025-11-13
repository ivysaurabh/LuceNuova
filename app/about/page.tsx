"use client";

import { useRef } from "react";
import Link from 'next/link';
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Award, Globe, ArrowRight, Heart } from "lucide-react";


// Animation variants
const fadeInUp = {
  initial: { y: 60, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function AboutUsPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const teamMembers = [
    {
      name: "Vijayesh",
      role: "Marketing Manager",
      image: "https://media.istockphoto.com/id/1223477625/vector/male-default-avatar-profile-icon-man-face-silhouette-person-placeholder-vector-illustration.jpg?s=1024x1024&w=is&k=20&c=mbLBRNbJ-xpU0_JxI_LuxNdlYvp8BQEixgQmAjBxye4=",
    },
    {
      name: "Pratham",
      role: "Product Manager",
      image: "https://media.istockphoto.com/id/1223477625/vector/male-default-avatar-profile-icon-man-face-silhouette-person-placeholder-vector-illustration.jpg?s=1024x1024&w=is&k=20&c=mbLBRNbJ-xpU0_JxI_LuxNdlYvp8BQEixgQmAjBxye4=",
    },
    {
      name: "Pratibha",
      role: "Marketing Manager",
      image: "https://www.shutterstock.com/image-vector/hand-drawn-modern-woman-avatar-600nw-1373621021.jpg",
    },
    {
      name: "Saurabh",
      role: "Lead Developer",
      image: "https://media.istockphoto.com/id/1223477625/vector/male-default-avatar-profile-icon-man-face-silhouette-person-placeholder-vector-illustration.jpg?s=1024x1024&w=is&k=20&c=mbLBRNbJ-xpU0_JxI_LuxNdlYvp8BQEixgQmAjBxye4=",
    },
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "100+", label: "Countries Served" },
    { number: "5★", label: "Average Rating" },
    { number: "24/7", label: "Customer Support" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              LUCE NUOVA
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're passionate about creating exceptional experiences and creating 
              products that gives joy in people's lives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section ref={ref} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInUp}>
              <div className="relative group">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                  alt="Our team"
                  className="rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-blue-600/10 rounded-2xl group-hover:bg-transparent transition-colors duration-300"></div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                Everything began with a simple question: Where has all the soul gone? In a market saturated with minimalism and the cold grace of brutalism, we felt a deep longing for the textures, colors, and stories that connect us to our heritage. This led us on a mission to seek out and partner with the most creative and original cloth makers in the world—those who share our vision for a more culturally-rich and artistically-inclusive future.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                This project is a fresh start. We exist to represent the art and culture that is currently being overshadowed by a dominant Western narrative of stark aesthetics. We believe that the intricate embroidery of a village, the bold patterns of a traditional ceremony, and the unique vision of a local painter are not relics of the past, but vital ingredients for a vibrant future.
              </p>
              <Button className="group">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="h-12 w-12" />,
                title: "Innovation",
                description: "Creating authentic, original poroducts."
              },
              {
                icon: <Users className="h-12 w-12" />,
                title: "Collaboration",
                description: "Creating opportunities for artists and clothmakers."
              },
              {
                icon: <Heart className="h-12 w-12" />,
                title: "Passion",
                description: "Building a community to reclaim our heritage."
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card className="h-full text-center p-8 hover:shadow-xl transition-all duration-300 border-0 bg-white">
                  <CardContent className="p-0">
                    <div className="text-blue-600 mb-4 flex justify-center">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="p-6">
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet The Founders</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The people who started all this
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group text-center"
              >
                <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-blue-600">{member.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Award className="h-16 w-16 mx-auto mb-6 text-blue-400" />
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers and experience the difference today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="group">
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="text-gray-900 border-white hover:bg-blue-200 hover:text-black"><Link href="/">
                View Products
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}