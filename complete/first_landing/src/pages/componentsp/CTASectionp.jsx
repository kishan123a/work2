import { Button } from "../ui/button";

const CTASection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
              Ready to start earning?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of labourers who are earning better and building their careers with us.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="hero" className="text-lg px-8">
              <a href="/register/">
              Register as a Labourer
              </a>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
             <a href = "#join-steps">Learn How it Works </a> 
            </Button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 border-t border-border">
            <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
              How it works
            </a>
            <a href="#join" className="text-muted-foreground hover:text-primary transition-colors">
              How to join
            </a>
            <a href="#faq" className="text-muted-foreground hover:text-primary transition-colors">
              FAQs
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;