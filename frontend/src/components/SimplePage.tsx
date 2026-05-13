import { motion } from 'framer-motion';

interface SimplePageProps {
  title: string;
  content: string;
}

const SimplePage = ({ title, content }: SimplePageProps) => {
  return (
    <div className="max-w-3xl mx-auto py-12 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="text-4xl font-bold text-primary">{title}</h1>
        <div className="prose max-w-none">
          <p className="text-lg leading-relaxed text-muted-foreground">
            {content}
          </p>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-8 bg-card border border-border rounded-3xl"
      >
        <h3 className="text-xl font-bold mb-4">Detailed Information</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This is a placeholder for the detailed {title.toLowerCase()} content. Student Toolkit Pro is committed to providing the best experience for students. If you have any specific questions regarding our {title.toLowerCase()}, please feel free to reach out to our support team.
        </p>
      </motion.div>
    </div>
  );
};

export default SimplePage;
