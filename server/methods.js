Meteor.methods({
    getFestivalData() {
        const festivalUrl = Meteor.settings.festivalApi;
        try {
            const festResp = HTTP.call('GET', festivalUrl, {

            });
            return festResp;
        } catch (e) {
            return false;
        }
    }
});