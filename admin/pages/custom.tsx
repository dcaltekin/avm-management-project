import MonthlyRentalsPage from "../components/MonthlyRentalsPage";
import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { Heading } from '@keystone-ui/core';

const CustomPage: React.FC = () => {
    return (
        <PageContainer header={<Heading type="h3">Monthly Collected Rents</Heading>}>
            <MonthlyRentalsPage />
        </PageContainer>
    );
};

export default CustomPage;
