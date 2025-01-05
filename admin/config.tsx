import { CustomNavigation } from './components/CustomNavigation';

function CustomLogo () {
    return <h3 style={{background: 'papayawhip'}}>Doğukan Çaltekin</h3>
}

export const components = {
  Navigation: CustomNavigation, 
  Logo: CustomLogo
};