'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Target, 
  Users, 
  BarChart3, 
  Shield, 
  Zap, 
  Award, 
  TrendingUp,
  CheckCircle,
  Star,
  Brain,
  Database,
  Clock,
  Globe,
  Heart,
  Lightbulb,
  Rocket
} from 'lucide-react';
import Link from 'next/link';

const AboutPage = () => {
  const features = [
    {
      icon: Brain,
      title: 'Advanced AI Technology',
      description: 'Our machine learning algorithms analyze 50+ factors including player form, weather, pitch conditions, and historical data.',
    },
    {
      icon: Target,
      title: '95%+ Accuracy Rate',
      description: 'Proven track record with industry-leading prediction accuracy backed by comprehensive data analysis.',
    },
    {
      icon: Database,
      title: 'Comprehensive Database',
      description: 'Access to detailed player statistics, team performance data, and match analytics from around the world.',
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Live match data, instant notifications, and real-time prediction adjustments during matches.',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Bank-grade security, 99.9% uptime, and complete data protection for all our users.',
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: '24/7 customer support from cricket experts and technical specialists.',
    },
  ];

  const stats = [
    { icon: Users, label: 'Active Users', value: '50K+' },
    { icon: Trophy, label: 'Predictions Made', value: '1M+' },
    { icon: Target, label: 'Accuracy Rate', value: '95%+' },
    { icon: Globe, label: 'Countries Served', value: '15+' },
  ];

  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'CEO & Founder',
      description: 'Former cricket analyst with 15+ years experience in sports analytics and AI.',
      avatar: 'RK',
    },
    {
      name: 'Priya Sharma',
      role: 'CTO',
      description: 'AI/ML expert with background in predictive modeling and data science.',
      avatar: 'PS',
    },
    {
      name: 'Amit Patel',
      role: 'Head of Cricket Analytics',
      description: 'Ex-professional cricket coach and statistical analyst.',
      avatar: 'AP',
    },
    {
      name: 'Sneha Gupta',
      role: 'Product Manager',
      description: 'Product strategy expert focused on user experience and fantasy sports.',
      avatar: 'SG',
    },
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Company Founded',
      description: 'Started with a vision to revolutionize cricket predictions using AI.',
    },
    {
      year: '2021',
      title: 'First AI Model',
      description: 'Launched our first machine learning model with 85% accuracy.',
    },
    {
      year: '2022',
      title: '10K Users',
      description: 'Reached 10,000 active users and expanded to multiple cricket formats.',
    },
    {
      year: '2023',
      title: 'Dream11 Integration',
      description: 'Introduced Dream11 team suggestions and fantasy cricket features.',
    },
    {
      year: '2024',
      title: '50K Users & 95% Accuracy',
      description: 'Achieved 50,000+ users and industry-leading 95% prediction accuracy.',
    },
    {
      year: '2025',
      title: 'Global Expansion',
      description: 'Expanding to international markets and adding new sports.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Trophy className="h-4 w-4 mr-2" />
              About SportPredict
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Revolutionizing Cricket
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> Predictions</span>
              <br />with AI Technology
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to help cricket fans make smarter decisions in fantasy leagues using cutting-edge artificial intelligence and comprehensive data analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold" asChild>
                <Link href="/auth/register">
                  <Rocket className="h-5 w-5 mr-2" />
                  Get Started Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold" asChild>
                <Link href="/matches">
                  View Live Matches
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Mission & Vision
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-700 leading-relaxed">
                  To democratize cricket analytics and empower every fan with AI-driven insights that were once available only to professional teams. We believe everyone deserves access to accurate, data-backed predictions.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-700 leading-relaxed">
                  To become the global leader in sports prediction technology, expanding beyond cricket to all major sports while maintaining our commitment to accuracy, innovation, and user satisfaction.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Makes Us Different
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cutting-edge technology meets cricket expertise to deliver unmatched prediction accuracy
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Passionate cricket enthusiasts and technology experts working together
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">{member.avatar}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <Badge className="mb-3">{member.role}</Badge>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From a simple idea to India's leading cricket prediction platform
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{milestone.year}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <Card className="border-0 shadow-md">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Accuracy First</h3>
                <p className="text-gray-600">We prioritize prediction accuracy above all else, continuously improving our algorithms and data sources.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">User-Centric</h3>
                <p className="text-gray-600">Every feature we build is designed with our users in mind, ensuring the best possible experience.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Innovation</h3>
                <p className="text-gray-600">We constantly push the boundaries of what's possible in sports analytics and prediction technology.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Start your journey with SportPredict today and experience the future of cricket predictions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold" asChild>
                <Link href="/auth/register">
                  <Users className="h-5 w-5 mr-2" />
                  Sign Up Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold" asChild>
                <Link href="/support">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;