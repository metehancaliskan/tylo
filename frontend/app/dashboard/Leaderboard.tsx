"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const fakeLeaderboard = [
  {
    username: "alice",
    xProfileImage: undefined,
    mindshare: 1200,
    flowScore: 980,
    wallet: "0xA1B2...C3D4",
    badges: ["OG"],
  },
  {
    username: "bob",
    xProfileImage: undefined,
    mindshare: 1100,
    flowScore: 1050,
    wallet: "0xB2C3...D4E5",
    badges: ["Builder"],
  },
  {
    username: "charlie",
    xProfileImage: undefined,
    mindshare: 950,
    flowScore: 900,
    wallet: "0xC3D4...E5F6",
    badges: ["Early"],
  },
  {
    username: "x_user",
    xProfileImage: "https://pbs.twimg.com/profile_images/1866863894104309760/wY4JTuca_normal.jpg",
    mindshare: 900,
    flowScore: 1200,
    wallet: "0xD4E5...F6A7",
    badges: ["Narrative"],
  },
  {
    username: "metehan",
    xProfileImage: "https://pbs.twimg.com/profile_images/1941521887277821952/a670jJZu_normal.jpg",
    mindshare: 870,
    flowScore: 1100,
    wallet: "0xE5F6...A7B8",
    badges: ["FlowDAO", "OG"],
  },
  {
    username: "tylo",
    xProfileImage: undefined,
    mindshare: 820,
    flowScore: 950,
    wallet: "0xF6A7...B8C9",
    badges: ["Beta"],
  },
  {
    username: "blockchain_guru",
    xProfileImage: undefined,
    mindshare: 800,
    flowScore: 1000,
    wallet: "0xA7B8...C9D0",
    badges: ["Expert"],
  },
  {
    username: "socialfi_queen",
    xProfileImage: undefined,
    mindshare: 780,
    flowScore: 890,
    wallet: "0xB8C9...D0E1",
    badges: ["Narrative", "Beta"],
  },
];

export function Leaderboard() {
  return (
    <Card className="w-full max-w-5xl mb-8">
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">#</th>
              <th className="py-2">User</th>
              <th className="py-2">Mindshare Score</th>
              <th className="py-2">FLOW Narrative Score</th>
              <th className="py-2">Wallet</th>
              <th className="py-2">Badges</th>
            </tr>
          </thead>
          <tbody>
            {fakeLeaderboard.map((user, i) => (
              <tr key={user.username} className="border-b last:border-0">
                <td className="py-2 font-bold text-center">{i + 1}</td>
                <td className="py-2 flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    {user.xProfileImage ? (
                      <AvatarImage src={user.xProfileImage} alt={user.username} />
                    ) : (
                      <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                    )}
                  </Avatar>
                  <span className="font-semibold">{user.username}</span>
                </td>
                <td className="py-2 text-center text-lg font-bold text-primary">{user.mindshare}</td>
                <td className="py-2 text-center text-lg font-bold text-green-600">{user.flowScore}</td>
                <td className="py-2 font-mono text-xs text-muted-foreground">{user.wallet}</td>
                <td className="py-2 flex flex-wrap gap-1">
                  {user.badges.map((badge, idx) => (
                    <span key={idx} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-semibold">
                      {badge}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
} 