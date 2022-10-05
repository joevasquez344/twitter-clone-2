const SidebarRow = ({ Icon, title }) => {
  return (
    <div className="group flex items-center justify-center max-w-fit md:space-x-5 md:px-5 py-3 rounded-full hover:bg-gray-100 cursor-pointer transition-all duration-200">
      <Icon className="h-6 w-6 " />
      <p className="hidden  md:inline-flex text-base font-normal  md:text-xl lg:text-xl">
        {title}
      </p>
    </div>
  );
};

export default SidebarRow;
