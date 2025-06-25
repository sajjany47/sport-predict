'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setMatches } from '@/store/slices/matchSlice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import MatchCard from '@/components/ui/match-card';
import { Search, Filter, Calendar, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MatchesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const dispatch = useDispatch();
  const router = useRouter();
  const { matches } = useSelector((state: RootState) => state.matches);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Mock matches data
  useEffect(() => {
    const mockMatches = [
      {
        id: '1',
        teamA: { name: 'India', flag: '🇮🇳' },
        teamB: { name: 'Australia', flag: '🇦🇺' },
        date: '2025-01-15',
        time: '14:30',
        venue: 'Melbourne Cricket Ground',
        league: 'Test Series',
        status: 'upcoming' as const,
      },
      {
        id: '2',
        teamA: { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
        teamB: { name: 'Pakistan', flag: '🇵🇰' },
        date: '2025-01-16',
        time: '19:30',
        venue: 'Lord\'s Cricket Ground',
        league: 'ODI Series',
        status: 'upcoming' as const,
      },
      {
        id: '3',
        teamA: { name: 'South Africa', flag: '🇿🇦' },
        teamB: { name: 'New Zealand', flag: '🇳🇿' },
        date: '2025-01-17',
        time: '16:00',
        venue: 'Cape Town Stadium',
        league: 'T20 Series',
        status: 'live' as const,
        liveScore: {
          teamAScore: '156/4 (18.2 ov)',
          teamBScore: '142/8 (20 ov)',
        },
      },
      {
        id: '4',
        teamA: { name: 'West Indies', flag: '🇼🇸' },
        teamB: { name: 'Bangladesh', flag: '🇧🇩' },
        date: '2025-01-12',
        time: '14:00',
        venue: 'Kensington Oval',
        league: 'ODI Series',
        status: 'completed' as const,
        result: {
          winner: 'West Indies',
          margin: 'by 6 wickets',
        },
      },
      {
        id: '5',
        teamA: { name: 'Sri Lanka', flag: '🇱🇰' },
        teamB: { name: 'Afghanistan', flag: '🇦🇫' },
        date: '2025-01-13',
        time: '15:30',
        venue: 'R. Premadasa Stadium',
        league: 'T20 Series',
        status: 'completed' as const,
        result: {
          winner: 'Sri Lanka',
          margin: 'by 25 runs',
        },
      },
    ];
    
    dispatch(setMatches(mockMatches));
  }, [dispatch]);

  const handleMatchClick = (matchId: string) => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    router.push(`/matches/${matchId}`);
  };

  const filteredMatches = matches.filter(match => {
    const matchesSearch = 
      match.teamA.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.teamB.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.league.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.venue.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = match.status === activeTab;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cricket Matches
          </h1>
          <p className="text-xl text-gray-600">
            Get AI-powered predictions for all cricket matches
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search matches, teams, venues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </div>
        </div>

        {/* Match Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="upcoming" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Upcoming ({matches.filter(m => m.status === 'upcoming').length})</span>
            </TabsTrigger>
            <TabsTrigger value="live" className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Live ({matches.filter(m => m.status === 'live').length})</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center space-x-2">
              <span>Completed ({matches.filter(m => m.status === 'completed').length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {filteredMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    showPredictButton
                    onClick={() => handleMatchClick(match.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No upcoming matches found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="live" className="space-y-6">
            {filteredMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onClick={() => handleMatchClick(match.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No live matches</h3>
                <p className="text-gray-600">Check back later for live cricket action</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {filteredMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onClick={() => handleMatchClick(match.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No completed matches found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MatchesPage;