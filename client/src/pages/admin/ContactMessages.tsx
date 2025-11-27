import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Filter,
  Eye,
  Reply,
  Trash2
} from 'lucide-react';
import { contactService } from '@/services/contact';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'replied' | 'spam';
  isRead: boolean;
  createdAt: string;
}

const ContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'replied' | 'spam'>('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await contactService.getContactMessages();
      // setMessages(response.data);
      
      // Mock data for now
      setTimeout(() => {
        setMessages([
          {
            _id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            subject: 'Project Collaboration',
            message: 'I would like to discuss a potential project collaboration...',
            status: 'pending',
            isRead: false,
            createdAt: new Date().toISOString()
          },
          {
            _id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            subject: 'Website Feedback',
            message: 'Great portfolio! I have some feedback...',
            status: 'replied',
            isRead: true,
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      replied: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      spam: { color: 'bg-red-100 text-red-800', icon: AlertCircle }
    };
    
    const { color, icon: Icon } = variants[status as keyof typeof variants] || variants.pending;
    
    return (
      <Badge className={color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-600 mt-1">Manage and respond to contact form submissions</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="replied">Replied</option>
              <option value="spam">Spam</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="grid gap-4">
        {filteredMessages.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">No messages found</h3>
              <p className="text-gray-600 mt-1">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No messages match your filters.' 
                  : 'No contact messages yet.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredMessages.map((message) => (
            <Card key={message._id} className={!message.isRead ? 'border-l-4 border-l-blue-500' : ''}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900">{message.name}</h3>
                        {getStatusBadge(message.status)}
                        {!message.isRead && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            New
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-1">{message.email}</p>
                    <h4 className="font-medium text-gray-900 mb-2">{message.subject}</h4>
                    <p className="text-gray-700 line-clamp-2">{message.message}</p>
                  </div>
                  
                  <div className="flex space-x-2 sm:flex-col sm:space-x-0 sm:space-y-2">
                    <Button size="sm" variant="outline" className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center space-x-1">
                      <Reply className="w-4 h-4" />
                      <span>Reply</span>
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center space-x-1 text-red-600">
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ContactMessages;