#import <Foundation/Foundation.h>
#import <GlympsePrivateAPI/Glympse.h>
#import <EnRouteApi/EnRouteApi.h>

@interface ObjectEncoder : NSObject

+(NSDictionary*)encodeAny:(const Glympse::GCommonObj&)obj;
+(NSDictionary*)encodeTask:(Glympse::EnRoute::GTask)task  encodeLocationArrays:(BOOL)encodeLocationArrays;
+(NSDictionary*)encodeOperation:(Glympse::EnRoute::GOperation)operation  encodeLocationArrays:(BOOL)encodeLocationArrays;
+(NSDictionary*)encodeTicket:(Glympse::GTicket)ticket encodeLocationArrays:(BOOL)encodeLocationArrays;
+(NSDictionary*)encodePlace:(Glympse::GPlace)place;
+(NSDictionary*)encodeTrack:(Glympse::GTrack)track encodeLocationArrays:(BOOL)encodeLocationArrays;
+(NSDictionary*)encodeLatLng:(Glympse::GLatLng)latLng;
+(NSDictionary*)encodeOrganization:(Glympse::EnRoute::GOrganization)organization;
+(NSDictionary*)encodeOrgConfig:(Glympse::EnRoute::GOrgConfig)orgConfig;
+(NSDictionary*)encodeAgent:(Glympse::EnRoute::GAgent)agent;

+(NSArray*)encodeMetadata:(Glympse::GArray<Glympse::GPrimitive>::ptr)metadata;
+(NSArray*)encodeLocationList:(Glympse::GList<Glympse::GLocation>::ptr)locations;
+(NSArray*)encodeStringArray:(Glympse::GArray<Glympse::GString>::ptr)strings;

@end

@interface NSString (glympse)

+ (NSString *)stringWithGString:(const Glympse::GString &)gString;

@end
