import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Megaphone, X, ChevronRight, Sparkles } from 'lucide-react';
import { Language } from '../App';

interface Announcement {
  id: string;
  title: {
    en: string;
    hi: string;
  };
  message: {
    en: string;
    hi: string;
  };
  date: string;
  isNew: boolean;
  category: 'feature' | 'update' | 'event' | 'maintenance';
}

interface AnnouncementsProps {
  language: Language;
}

export function Announcements({ language }: AnnouncementsProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 'chatbot-launch-2025',
      title: {
        en: '🤖 Our AI Chatbot is Live!',
        hi: '🤖 हमारा AI चैटबॉट लाइव है!'
      },
      message: {
        en: 'We are excited to announce that our new STEM AI Chatbot for students is now live! Get instant help with your Science, Technology, Engineering, and Maths questions. Try it out from the Student dashboard!',
        hi: 'हम यह घोषणा करते हुए उत्साहित हैं कि हमारा नया STEM AI चैटबॉट अब लाइव है! विज्ञान, गणित, इंजीनियरिंग और प्रौद्योगिकी के प्रश्नों में तुरंत सहायता प्राप्त करें। डैशबोर्ड से इसे आज़माएं!'
      },
      date: '2025-11-24',
      isNew: true,
      category: 'feature'
    }
  ]);
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState<Set<string>>(new Set());
  const [expandedAnnouncement, setExpandedAnnouncement] = useState<string | null>(null);

  // Load dismissed announcements from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dismissedAnnouncements');
    if (saved) {
      setDismissedAnnouncements(new Set(JSON.parse(saved)));
    }
  }, []);

  const dismissAnnouncement = (id: string) => {
    const newDismissed = new Set(dismissedAnnouncements);
    newDismissed.add(id);
    setDismissedAnnouncements(newDismissed);
    localStorage.setItem('dismissedAnnouncements', JSON.stringify([...newDismissed]));
    if (expandedAnnouncement === id) {
      setExpandedAnnouncement(null);
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedAnnouncement(expandedAnnouncement === id ? null : id);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'feature':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'update':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'event':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, { en: string; hi: string }> = {
      feature: { en: 'New Feature', hi: 'नई सुविधा' },
      update: { en: 'Update', hi: 'अपडेट' },
      event: { en: 'Event', hi: 'कार्यक्रम' },
      maintenance: { en: 'Maintenance', hi: 'रखरखाव' }
    };
    return labels[category][language];
  };

  const visibleAnnouncements = announcements.filter(
    (announcement) => !dismissedAnnouncements.has(announcement.id)
  );

  if (visibleAnnouncements.length === 0) {
    return null;
  }

  const translations = {
    en: {
      title: 'Platform Announcements',
      description: 'Latest updates and news from Team INSPIRA',
      viewAll: 'View All',
      dismiss: 'Dismiss',
      readMore: 'Read more',
      readLess: 'Read less'
    },
    hi: {
      title: 'प्लेटफ़ॉर्म घोषणाएं',
      description: 'टीम INSPIRA से नवीनतम अपडेट और समाचार',
      viewAll: 'सभी देखें',
      dismiss: 'खारिज करें',
      readMore: 'और पढ़ें',
      readLess: 'कम पढ़ें'
    }
  };

  const t = translations[language];

  return (
    <Card className="border-2 border-blue-200 bg-linear-to-br from-blue-50 via-white to-purple-50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {t.title}
                {visibleAnnouncements.some(a => a.isNew) && (
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                )}
              </CardTitle>
              <CardDescription>{t.description}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {visibleAnnouncements.map((announcement) => (
          <div
            key={announcement.id}
            className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold text-gray-900">
                    {announcement.title[language]}
                  </h4>
                  {announcement.isNew && (
                    <Badge className="bg-red-500 text-white px-2 py-0.5">
                      {language === 'en' ? 'NEW' : 'नया'}
                    </Badge>
                  )}
                  <Badge className={`${getCategoryColor(announcement.category)} px-2 py-0.5`}>
                    {getCategoryLabel(announcement.category)}
                  </Badge>
                </div>
                <p className={`text-gray-600 ${expandedAnnouncement === announcement.id ? '' : 'line-clamp-2'}`}>
                  {announcement.message[language]}
                </p>
                {announcement.message[language].length > 150 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(announcement.id)}
                    className="p-0 h-auto text-blue-600 hover:text-blue-700"
                  >
                    {expandedAnnouncement === announcement.id ? (
                      <span className="flex items-center gap-1">
                        {t.readLess}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        {t.readMore}
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    )}
                  </Button>
                )}
                <p className="text-xs text-gray-500">
                  {new Date(announcement.date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissAnnouncement(announcement.id)}
                className="p-1 h-auto hover:bg-gray-100 rounded shrink-0"
                aria-label={t.dismiss}
              >
                <X className="w-4 h-4 text-gray-500" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}