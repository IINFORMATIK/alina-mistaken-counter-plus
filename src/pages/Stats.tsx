
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Calendar, Clock, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface StatEntry {
  timestamp: string;
  date: string;
  time: string;
  count: number;
}

const Stats = () => {
  const [stats, setStats] = useState<StatEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const savedStats = localStorage.getItem('alina-stats');
    const savedCount = localStorage.getItem('alina-counter');
    
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
    if (savedCount) {
      setTotalCount(parseInt(savedCount));
    }
  }, []);

  // Группировка по дням
  const dailyStats = stats.reduce((acc, entry) => {
    const date = new Date(entry.timestamp).toLocaleDateString('ru-RU');
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dailyData = Object.entries(dailyStats).map(([date, count]) => ({
    date,
    count
  })).slice(-7); // Последние 7 дней

  // Группировка по часам
  const hourlyStats = stats.reduce((acc, entry) => {
    const hour = new Date(entry.timestamp).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const hourlyData = Array.from({length: 24}, (_, i) => ({
    hour: `${i}:00`,
    count: hourlyStats[i] || 0
  }));

  // Топ часы
  const topHours = Object.entries(hourlyStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([hour, count]) => ({
      hour: `${hour}:00`,
      count,
      color: ['#ff6b6b', '#4ecdc4', '#45b7d1'][Object.entries(hourlyStats).sort(([,a], [,b]) => b - a).findIndex(([h]) => h === hour)]
    }));

  const pieData = topHours.map((item, index) => ({
    name: item.hour,
    value: item.count,
    fill: item.color
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              📊 Статистика путаниц
            </h1>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-yellow-300" />
              <div>
                <p className="text-sm opacity-80">Всего путаниц</p>
                <p className="text-3xl font-bold">{totalCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-300" />
              <div>
                <p className="text-sm opacity-80">Дней отслеживания</p>
                <p className="text-3xl font-bold">{Object.keys(dailyStats).length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-300" />
              <div>
                <p className="text-sm opacity-80">Среднее в день</p>
                <p className="text-3xl font-bold">
                  {Object.keys(dailyStats).length > 0 
                    ? (totalCount / Object.keys(dailyStats).length).toFixed(1)
                    : 0}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Chart */}
          <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Путаницы по дням (последние 7 дней)
            </h3>
            {dailyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                  <XAxis dataKey="date" stroke="white" fontSize={12} />
                  <YAxis stroke="white" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white'
                    }} 
                  />
                  <Bar dataKey="count" fill="url(#gradient1)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff6b6b" />
                      <stop offset="100%" stopColor="#ee5a52" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-white/60">
                Пока нет данных для отображения
              </div>
            )}
          </Card>

          {/* Hourly Chart */}
          <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Активность по часам
            </h3>
            {stats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                  <XAxis dataKey="hour" stroke="white" fontSize={10} interval={3} />
                  <YAxis stroke="white" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#4ecdc4" 
                    strokeWidth={3}
                    dot={{ fill: '#4ecdc4', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#26d0ce' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-white/60">
                Начните считать, чтобы увидеть график!
              </div>
            )}
          </Card>
        </div>

        {/* Top Hours and Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Hours Pie Chart */}
          <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">
              🏆 Топ часы путаниц
            </h3>
            {topHours.length > 0 ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({name, value}) => `${name}: ${value}`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {topHours.map((item, index) => (
                    <div key={item.hour} className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.hour}</span>
                      </div>
                      <span className="font-semibold">{item.count} раз</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-white/60">
                Недостаточно данных
              </div>
            )}
          </Card>

          {/* Recent Activity */}
          <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">
              ⏰ Последние путаницы
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {stats.slice(-10).reverse().map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="text-white">
                    <p className="font-medium">#{entry.count}</p>
                    <p className="text-sm opacity-70">
                      {new Date(entry.timestamp).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <div className="text-white/80 text-sm">
                    {new Date(entry.timestamp).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
              {stats.length === 0 && (
                <div className="text-center text-white/60 py-8">
                  Пока нет записей о путаницах
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Stats;
