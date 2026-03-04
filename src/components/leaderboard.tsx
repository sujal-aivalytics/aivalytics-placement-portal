'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userEmail: string;
  userImage: string | null;
  testTitle: string;
  testCompany: string | null;
  testTopic: string | null;
  score: number;
  total: number;
  percentage: number;
  completedAt: Date;
}

interface LeaderboardProps {
  testId?: string;
  limit?: number;
}

export default function Leaderboard({ testId, limit = 10 }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      if (testId) params.append('testId', testId);

      const res = await fetch(`/api/leaderboard?${params}`);
      const data = await res.json();

      if (res.ok) {
        setLeaderboard(data.leaderboard);
        setUserRank(data.userRank);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }, [testId, limit]);

  useEffect(() => {
    fetchLeaderboard();
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0 shadow-none px-2 py-0.5 text-[10px] font-bold">Champion</Badge>;
    if (rank === 2) return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-0 shadow-none px-2 py-0.5 text-[10px] font-bold">Runner-up</Badge>;
    if (rank === 3) return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-0 shadow-none px-2 py-0.5 text-[10px] font-bold">3rd Place</Badge>;
    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Leaderboard
            </CardTitle>
            <CardDescription>
              {testId ? 'Test Rankings' : 'Global Rankings'}
            </CardDescription>
          </div>
          {userRank && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Your Rank</p>
              <p className="text-2xl font-bold text-primary">#{userRank}</p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {leaderboard.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No results yet. Be the first to take a test!
          </p>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry) => (
              <div
                key={`${entry.userId}-${entry.completedAt}`}
                className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-md transition-all group"
              >
                <div className="flex-shrink-0 w-8 flex items-center justify-center font-bold text-gray-500">
                  {getRankIcon(entry.rank)}
                </div>

                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                  <AvatarImage src={entry.userImage || undefined} alt={entry.userName} />
                  <AvatarFallback>{entry.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-gray-900 truncate text-sm">{entry.userName}</p>
                    <div className="transform scale-90 origin-left">
                      {getRankBadge(entry.rank)}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 truncate font-medium">
                    {entry.testCompany || entry.testTopic || entry.testTitle}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className={`text-lg font-bold ${entry.percentage >= 80 ? 'text-green-600' : 'text-blue-600'}`}>
                    {entry.percentage}%
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {entry.score}/{entry.total}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
