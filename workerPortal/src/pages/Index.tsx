
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, HardHat, Camera } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">SafetyWatch Pro</h1>
                <p className="text-sm text-slate-600">Sustainable Mining Safety Platform</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Building a Sustainable Mining Future
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Advanced safety verification and monitoring system ensuring worker protection 
            while maintaining environmental responsibility in mining operations.
          </p>
        </div>

        {/* Worker Interface Card */}
        <div className="max-w-md mx-auto mb-12">
          <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Shield className="w-12 h-12 text-emerald-600 mb-4 mx-auto" />
              <CardTitle className="text-2xl text-slate-800">Worker Safety Verification</CardTitle>
              <CardDescription className="text-slate-600">
                Real-time safety equipment verification and compliance monitoring for mine workers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/worker">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-6">
                  Access Worker Interface
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="border-emerald-200">
            <CardHeader>
              <HardHat className="w-8 h-8 text-emerald-600 mb-2" />
              <CardTitle className="text-lg text-slate-800">Safety Equipment Detection</CardTitle>
              <CardDescription>
                Automated verification of required safety equipment including hard hats, safety vests, goggles, and gloves
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-emerald-200">
            <CardHeader>
              <Camera className="w-8 h-8 text-emerald-600 mb-2" />
              <CardTitle className="text-lg text-slate-800">3-Attempt Verification</CardTitle>
              <CardDescription>
                Comprehensive safety check system with multiple attempts and detailed feedback for compliance
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-xl shadow-sm border border-emerald-200 p-8">
          <h3 className="text-2xl font-bold text-slate-800 text-center mb-8">
            Safety & Sustainability Impact
          </h3>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">99.8%</div>
              <div className="text-slate-600">Safety Compliance Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">24/7</div>
              <div className="text-slate-600">Continuous Monitoring</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">Zero</div>
              <div className="text-slate-600">Environmental Incidents</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
