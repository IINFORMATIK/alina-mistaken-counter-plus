
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BarChart3, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCounter } from '@/hooks/useCounter';

const Index = () => {
  const { count, isLoading, incrementCounter } = useCounter();
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = async () => {
    await incrementCounter();
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
            🎭 Дикий Счётчик Алины
          </h1>
          <Link to="/stats">
            <Button variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm">
              <BarChart3 className="mr-2 h-4 w-4" />
              Статистика
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-8 max-w-2xl mx-auto">
          {/* Counter Display */}
          <Card className="p-8 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <div className="text-white mb-6">
              <p className="text-lg md:text-xl mb-2 opacity-90">
                Количество путаниц:
              </p>
              <div className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent animate-pulse">
                {count}
              </div>
            </div>
          </Card>

          {/* Main Button */}
          <div className="relative">
            <Button
              onClick={handleClick}
              className={`
                w-full max-w-lg h-32 md:h-40 text-xl md:text-2xl font-bold
                bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400
                hover:from-yellow-300 hover:via-orange-300 hover:to-red-300
                text-black shadow-2xl border-4 border-white/30
                transform transition-all duration-200
                ${isPressed ? 'scale-95 shadow-lg' : 'hover:scale-105'}
                rounded-2xl relative overflow-hidden
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
              <span className="relative z-10 px-4 leading-tight">
                Меня спутали с<br />
                Лопиной Алиной Юрьевной! 🤦‍♀️
              </span>
            </Button>
          </div>

          {/* Fun Stats */}
          {count > 0 && (
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 animate-fade-in">
              <div className="text-white space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-lg font-semibold">Сегодняшние достижения</span>
                </div>
                <p className="text-sm opacity-80">
                  {count === 1 
                    ? "Первая путаница дня! 🎉" 
                    : count < 5 
                      ? "Неплохой старт! 💪"
                      : count < 10
                        ? "Набираем обороты! 🚀"
                        : "Алина-легенда! 👑"
                  }
                </p>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-white/70">
        <p className="text-sm">
          Создано с ❤️ для самой путаемой Алины в мире
        </p>
      </footer>
    </div>
  );
};

export default Index;
