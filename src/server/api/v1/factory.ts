import { error, output } from '../../utils';

export const getfactory = (r) => {
    try {
        return output({ data: process.env.ADDRESS_FACTORY });

    } catch (e) {
        return error(500000, 'Failed to get factory address', null);
    }
};
