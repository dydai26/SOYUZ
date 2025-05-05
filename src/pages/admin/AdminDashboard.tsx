import React from "react";
import { Link } from "react-router-dom";
import { Newspaper } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/admin/AdminLayout";
import { mockNewsArticles } from "@/services/mockData";

const AdminDashboard = () => {
  const totalNews = mockNewsArticles.length;

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">Панель керування</h1>

        <div className="mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Новини</CardTitle>
              <CardDescription>Загальна кількість новин</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{totalNews}</div>
                <Newspaper className="h-8 w-8 text-brand-blue" />
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Останнє оновлення: {new Date().toLocaleDateString("uk-UA")}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Швидкі дії</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link 
                  to="/admin/news/new" 
                  className="block w-full p-3 bg-brand-blue text-white rounded-md hover:bg-brand-lightBlue transition-colors text-center"
                >
                  Опублікувати новину
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
