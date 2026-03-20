import { Inbox } from "lucide-react";

const EmptyState = ({ title = "Nothing here yet", description = "Check back later for updates 📭", icon: Icon = Inbox }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center opacity-60" role="status">
      <Icon size={48} className="mb-4" aria-hidden="true" />
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};

export default EmptyState;
