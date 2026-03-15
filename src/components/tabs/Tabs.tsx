import './style.css';

interface TabsProps {
	tabNames: string[];
	activeTab: number;
	onTabChange: (tabIndex:number) => void;
	className?: string;
}
const Tabs:React.FC<TabsProps> = ({tabNames, activeTab, onTabChange, className}) => {

	const handleClick = (index: number) => {
		onTabChange(index)
	}
	return (
		<div className={`tabs ${className || ''}`}>
			{tabNames.map((tabName: string, index:number) => 
				<button
					className={`tab ${activeTab === index ? 'active' : ''}`}
					onClick={() => { handleClick(index); }}
					key={tabName}
				>{tabName}</button>
			)}
		</div>
	);
}

export default Tabs;