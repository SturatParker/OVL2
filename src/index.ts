import { OVLClientService } from './services/OVLClient.service';

const ovlClient = new OVLClientService();

void ovlClient.start();
