'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Trophy, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';

interface Team {
  name: string;
  flag: string;
}

interface MatchCardProps {
  match: {
    id: string;
    teamA: Team;
    teamB: Team;
    date: string;
    time: string;
    venue: string;
    league: string;
    status: 'upcoming' | 'live' | 'completed';
    liveScore?: {
      teamAScore: string;
      teamBScore: string;
    };
    result?: {
      winner: string;
      margin: string;
    };
  };
  onClick?: () => void;
  showPredictButton?: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onClick, showPredictButton = false }) => {
  const getStatusBadge = () => {
    switch (match.status) {
      case 'live':
        return <Badge className="bg-red-500 hover:bg-red-600 animate-pulse">🔴 Live</Badge>;
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">✅ Completed</Badge>;
      default:
        return <Badge variant="outline">⏳ Upcoming</Badge>;
    }
  };

  const getTimeInfo = () => {
    if (match.status === 'live' && match.liveScore) {
      return (
        <div className="text-center">
          <div className="text-sm font-bold text-red-600">LIVE SCORE</div>
          <div className="text-xs text-gray-600">
            {match.teamA.name}: {match.liveScore.teamAScore}
          </div>
          <div className="text-xs text-gray-600">
            {match.teamB.name}: {match.liveScore.teamBScore}
          </div>
        </div>
      );
    }

    if (match.status === 'completed' && match.result) {
      return (
        <div className="text-center">
          <div className="text-sm font-bold text-green-600">{match.result.winner} Won</div>
          <div className="text-xs text-gray-600">{match.result.margin}</div>
        </div>
      );
    }

    return (
      <div className="text-center">
        <div className="flex items-center justify-center text-sm text-gray-600 mb-1">
          <Calendar className="h-3 w-3 mr-1" />
          {format(new Date(match.date), 'MMM dd')}
        </div>
        <div className="flex items-center justify-center text-sm text-gray-600">
          <Clock className="h-3 w-3 mr-1" />
          {match.time}
        </div>
      </div>
    );
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={onClick}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <Trophy className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">{match.league}</span>
          </div>
          {getStatusBadge()}
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">
                {match.teamA.name.slice(0, 3).toUpperCase()}
              </span>
            </div>
            <span className="font-medium text-gray-800 truncate">{match.teamA.name}</span>
          </div>

          <div className="mx-4 text-center">
            <div className="text-lg font-bold text-gray-400">VS</div>
          </div>

          <div className="flex items-center space-x-3 flex-1 justify-end">
            <span className="font-medium text-gray-800 truncate">{match.teamB.name}</span>
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-xs font-bold text-orange-600">
                {match.teamB.name.slice(0, 3).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Time/Score Info */}
        {getTimeInfo()}

        {/* Venue */}
        <div className="flex items-center justify-center text-xs text-gray-500 mt-3">
          <MapPin className="h-3 w-3 mr-1" />
          {match.venue}
        </div>

        {/* Predict Button */}
        {showPredictButton && match.status === 'upcoming' && (
          <div className="mt-4">
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform group-hover:scale-105 transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
            >
              Get AI Prediction
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchCard;