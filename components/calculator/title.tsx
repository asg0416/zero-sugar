interface TitleProps {
  title: string;
  desc?: string;
}

export const Title = ({ title, desc }: TitleProps) => {
  return (
    <div className="w-full flex flex-col items-start justify-center gap-y-4 mb-4">
      <h1 className="text-2xl font-semibold text-wrap break-keep">{title}</h1>
      <p className="text-muted-foreground text-sm break-keep">{desc}</p>
    </div>
  );
};
